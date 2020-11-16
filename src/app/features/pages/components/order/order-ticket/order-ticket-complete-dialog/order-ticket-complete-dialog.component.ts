// this is used to shut the ticket
import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import Swal from 'sweetalert2'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-order-ticket-complete-dialog',
  templateUrl: './order-ticket-complete-dialog.component.html',
  styleUrls: ['./order-ticket-complete-dialog.component.css'],
})
export class OrderTicketCompleteDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public ticket: any,
    private orderEndpoint: OrderEndpoint,
    private dialogRef: MatDialogRef<OrderTicketCompleteDialogComponent>,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    console.log(this.ticket)
  }

  public confirmShutTicket(): void {
    Swal.fire({
      title: 'Are you sure you want to finish this ticket?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.value) {
        this.orderEndpoint._updateTicketCompleteByTicketId(this.ticket['TicketId']).subscribe((value) => {
          console.log(value)
          this.sweetAlert.showSuccessMessage('This Ticket is over！')
          this.dialogRef.close()
        })
      }
    })
  }
}
