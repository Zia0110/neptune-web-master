import { Component, OnInit, OnChanges, Inject, ChangeDetectorRef, Input } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, Validators, FormBuilder } from '@angular/forms'

import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-order-consumer-detail-cancel-dialog',
  templateUrl: './order-consumer-detail-cancel-dialog.component.html',
  styleUrls: ['./order-consumer-detail-cancel-dialog.component.css'],
})
export class OrderConsumerDetailCancelDialogComponent implements OnInit {
  @Input() orderData?: any
  currentOrder: any
  cancelReason: string
  errorMessage: string

  constructor(
    private orderEndpoint: OrderEndpoint,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<OrderConsumerDetailCancelDialogComponent>,
    private sweetAlert: SweetAlertService,
    @Inject(MAT_DIALOG_DATA) public data?
  ) {}

  // Init with data passed from list
  ngOnInit(): void {
    this.currentOrder = this.orderData ? this.orderData : this.data
    this.cancelAvailableCheck(this.currentOrder)
  }

  // Check whether this order can be canceled by the Current User
  cancelAvailableCheck(order) {
    // if ( order.Status !=1 || order.status !=2 ){
    //     this.errorMessage = "该订单情况 不可退"
    // }
  }

  confirmCancel() {
    if (this.currentOrder.Status == 9) {
      return this.sweetAlert.showSweetAlert('This order is non-refundable')
    }
    let cancelOb = {
      Comment: this.cancelReason,
      OrderNo: this.currentOrder.OrderNo,
    }
    this.save(cancelOb)
  }

  save(cacnelationOB) {
    this.orderEndpoint._updateOrderReturnStatus(cacnelationOB).subscribe((res) => {
      console.log(res)
      this.currentOrder.Status = 9
      this.sweetAlert.showSuccessMessage('Successful charge back')
      // if (this.data) this.closeDialog()
    })
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
