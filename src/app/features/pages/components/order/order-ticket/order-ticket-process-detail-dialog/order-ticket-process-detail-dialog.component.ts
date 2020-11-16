import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'
import { MatTableDataSource } from '@angular/material/table'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-order-ticket-process-detail-dialog',
  templateUrl: './order-ticket-process-detail-dialog.component.html',
  styleUrls: ['./order-ticket-process-detail-dialog.component.css'],
})
export class OrderTicketProcessDetailDialogComponent implements OnInit {
  public displayedColumns: string[] = ['受理内容', '受理时间', '受理人']
  public dataForTable: any[] = []
  public dataSource: any
  public ticketId: string
  public userId: string
  public showNewTicketProcess: boolean = false
  public inputContent: string
  public contentForm: FormGroup
  public imagesInfo = { urlsArray: [], deleteAllowed: false }

  constructor(
    @Inject(MAT_DIALOG_DATA) public ticket: any,
    private orderEndpoint: OrderEndpoint,
    private fb: FormBuilder,
    private sweetAlert: SweetAlertService,
    private dialogRef: MatDialogRef<OrderTicketProcessDetailDialogComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.ticket)
    this.contentForm = this.fb.group({
      content: [''],
    })
    this.ticketId = this.ticket['TicketId']
    this.userId = this.ticket['InchargeUserId']
    this.buildTable()
    this.ticket.TicketImage.map((item) => {
      this.imagesInfo['urlsArray'].push(item.Url)
    })
    console.log(this.imagesInfo)
  }

  private buildTable(): void {
    for (let ticketProcess of this.ticket['TicketProcess']) {
      let a_obj: any = {
        Content: '',
        CreatedAt: '',
        UserName: '',
      }
      a_obj['Content'] = ticketProcess['Content']
      a_obj['CreatedAt'] = this.handleTime(ticketProcess['CreatedAt'])
      a_obj['UserName'] = ticketProcess['UserName']
      this.dataForTable.push(a_obj)
    }
    this.dataSource = new MatTableDataSource<any>(this.dataForTable)
  }

  private handleTime(date: string): string {
    let resDate: string
    let i = date.indexOf('T')
    resDate = date.slice(0, i)
    return resDate
  }

  public newTicketProcess(): void {
    // userId ticketId and Content
    this.showNewTicketProcess = true
  }

  public cancelTicketProcess(): void {
    this.showNewTicketProcess = false
  }

  public confirmTicketProcess(): void {
    let theContent = this.contentForm.value['content']
    //just commented for too much data
    this.orderEndpoint._createTicketProcess(this.userId, this.ticketId, theContent).subscribe((res) => {
      this.showNewTicketProcess = false
      this.sweetAlert.showSuccessMessage('Processing record created successfully')
      this.dialogRef.close()
    })
  }
}
