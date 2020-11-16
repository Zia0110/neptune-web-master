import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, Validators, FormBuilder } from '@angular/forms'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { OrderTicketNewDialogComponent } from '../../order-ticket/order-ticket-new/order-ticket-new-dialog.component'
import { OrderTicketCompleteDialogComponent } from '../../order-ticket/order-ticket-complete-dialog/order-ticket-complete-dialog.component'
import { OrderTicketProcessDetailDialogComponent } from '../../order-ticket/order-ticket-process-detail-dialog/order-ticket-process-detail-dialog.component'

@Component({
  selector: 'app-order-consumer-detail-customer-service',
  templateUrl: './order-consumer-detail-customer-service.component.html',
  styleUrls: ['./order-consumer-detail-customer-service.component.css'],
})
export class OrderConsumerDetailCustomerServiceComponent implements OnInit {
  @Input() orderId: any
  public allTickets: any
  public ticketsOfPickedOrderNo: any[] = []
  public displayedColumns: string[] = ['问题单内容', '受理时间', '受理人', '处理结果', '状态', '当前处理状况', 'Ticket详情', '处理关闭']
  public ticketsForTable: any[] = []
  public dataSource: any
  public ticketId: string
  public pickedOrderNo: string

  constructor(private orderEndpoint: OrderEndpoint, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.orderEndpoint._orderTicketList().subscribe((value) => {
      this.allTickets = value
      this.ticketsOfPickedOrderNo = this.filterTicketsWithPickedOrder()
      console.log(this.ticketsOfPickedOrderNo)
      // this.pickedOrderNo = this.ticketsOfPickedOrderNo[0]['OrderNo'] //coz they are all the same
      this.pickedOrderNo = this.ticketsOfPickedOrderNo.length == 0 ? '' : this.ticketsOfPickedOrderNo[0]['OrderNo']
      console.log(this.pickedOrderNo)
      this.handleTicketData()
      this.buildTable()
    })
  }

  getTicketDataFromBackEnd() {
    this.orderEndpoint._orderTicketList().subscribe((value) => {
      this.allTickets = value
      this.ticketsOfPickedOrderNo = this.filterTicketsWithPickedOrder()
      console.log(this.ticketsOfPickedOrderNo)
      // this.pickedOrderNo = this.ticketsOfPickedOrderNo[0]['OrderNo'] //coz they are all the same
      this.pickedOrderNo = this.ticketsOfPickedOrderNo.length == 0 ? '' : this.ticketsOfPickedOrderNo[0]['OrderNo']
      console.log(this.pickedOrderNo)
      this.ticketsForTable = []
      this.handleTicketData()
      this.buildTable()
      console.log(this.dataSource)
      this.dataSource._updateChangeSubscription()
    })
  }

  private filterTicketsWithPickedOrder(): any[] {
    return this.allTickets.filter((ticket) => ticket['OrderId'] == this.orderId)
  }

  private handleTicketData(): void {
    for (let ticket of this.ticketsOfPickedOrderNo) {
      ticket['CreatedAt'] = this.handleTime(ticket['CreatedAt'])
      ticket['Status'] = ticket['Status'] == 0 ? '未完成' : '已完成'
      // ticket["CurrentContent"] = "CurrentContent";
      if (ticket['Status'] == '已完成') {
        ticket['CurrentContent'] = '该Ticket已关闭'
      } else {
        ticket['CurrentContent'] = ticket['TicketProcess'].length != 0 ? ticket['TicketProcess'][0]['Content'] : '暂无状态'
      }
      this.ticketsForTable.push(ticket)
    }
  }

  private handleTime(date: string): string {
    let resDate: string
    let i = date.indexOf('T')
    resDate = date.slice(0, i)
    return resDate
  }

  private buildTable(): void {
    this.dataSource = new MatTableDataSource<any>(this.ticketsForTable)
  }

  //To check the ticket process details
  public ticketDetail(ticket): void {
    const dialogRef = this.dialog.open(OrderTicketProcessDetailDialogComponent, {
      width: '70%',
      height: '60%',
      data: ticket,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.getTicketDataFromBackEnd()
    })
  }

  // only needs ticket Id to shut it
  private toShutTicket(ticket): void {
    //ProcessRecordComponent is to shut the ticket
    const dialogRef = this.dialog.open(OrderTicketCompleteDialogComponent, {
      width: '50%',
      height: '50%',
      data: ticket,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.getTicketDataFromBackEnd()
    })
  }

  public addNewTicket(): void {
    let orderIdandNoForNewTicket: any = {
      orderId: this.orderId,
      orderNo: this.pickedOrderNo,
    }
    const dialogRef = this.dialog.open(OrderTicketNewDialogComponent, {
      width: '70%',
      height: '60%',
      data: orderIdandNoForNewTicket,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.getTicketDataFromBackEnd()
    })
  }
}
