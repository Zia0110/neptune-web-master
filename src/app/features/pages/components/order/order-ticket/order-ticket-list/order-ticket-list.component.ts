import { Component, OnInit, ViewChild } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatDialog } from '@angular/material/dialog'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'
import { OrderConsumerDetailDialogComponent } from '../../order-consumer-detail-dialog/order-consumer-detail-dialog.component'
import { OrderTicketCompleteDialogComponent } from '../order-ticket-complete-dialog/order-ticket-complete-dialog.component'
import { OrderTicketProcessDetailDialogComponent } from '../order-ticket-process-detail-dialog/order-ticket-process-detail-dialog.component'
import { OrderTicketNewDialogComponent } from '../order-ticket-new/order-ticket-new-dialog.component'
import { MatSort } from '@angular/material/sort'

@Component({
  selector: 'app-order-ticket-list',
  templateUrl: './order-ticket-list.component.html',
  styleUrls: ['./order-ticket-list.component.css'],
})
export class OrderTicketListComponent implements OnInit {
  public ticketsList: any
  public displayedColumns: string[] = ['订单号', '内容', '受理时间', '状态', '当前责任人', '当前处理状况', '查看', '处理关闭']
  public dataSource: any
  public ticketsForTable: any[] = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  public statusDropDown: any[] = [
    {
      view: '未完成',
      value: 0,
    },
  ]
  public pickedStatusId: number = 0

  constructor(private orderEndpoint: OrderEndpoint, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.setStatusDropDpwn()
    this.getTicketDataFromBackEnd()
  }

  private getTicketDataFromBackEnd(): void {
    this.ticketsForTable = [] // have to reset this
    this.orderEndpoint._orderTicketList().subscribe((value) => {
      this.ticketsList = value
      console.log(this.ticketsList)
      this.createTicketsForTable()
      this.buildTicketTable()
    })
  }

  private setStatusDropDpwn(): void {
    this.statusDropDown.push({
      view: '已完成',
      value: 1,
    })
  }

  public getStatus(statusId): void {
    console.log(statusId)
    this.pickedStatusId = statusId
    this.buildTicketTable()
  }

  private createTicketsForTable(): void {
    for (let ticket of this.ticketsList) {
      let a_obj: any = {
        CurrentContent: '',
        OrderNo: '',
        Content: '',
        CreatedAt: '',
        Progress: '',
        Status: '',
        InchargeUserName: '',
        TicketId: '',
        TicketProcess: [],
      }
      a_obj['Status'] = ticket['Status'] == 0 ? '未完成' : '已完成'
      if (a_obj['Status'] == '已完成') {
        a_obj['CurrentContent'] = '该Ticket已关闭'
      } else {
        // this is the last TP's content as the Ticket's currentContent
        a_obj['CurrentContent'] = ticket['TicketProcess'].length != 0 ? ticket['TicketProcess'][0]['Content'] : '暂无状态'
      }
      a_obj['OrderNo'] = ticket['OrderNo']
      a_obj['Content'] = ticket['Content']
      a_obj['CreatedAt'] = this.handleTime(ticket['CreatedAt'])
      a_obj['Progress'] = ticket['Progress']
      a_obj['InchargeUserId'] = ticket['InchargeUserId']
      a_obj['InchargeUserName'] = ticket['InchargeUserName']
      a_obj['TicketId'] = ticket['TicketId']
      ;(a_obj['TicketProcess'] = ticket['TicketProcess']), (a_obj['TicketImage'] = ticket['TicketImage'])

      this.ticketsForTable.push(a_obj)
    }
  }

  private handleTime(date: string): string {
    let resDate: string
    let i = date.indexOf('T')
    resDate = date.slice(0, i)
    return resDate
  }

  private buildTicketTable(): void {
    let filteredByStatusTicketsForTable: any[] = []
    if (this.pickedStatusId == 0) {
      filteredByStatusTicketsForTable = this.ticketsForTable.filter((ticket) => ticket['Status'] == '未完成')
    } else {
      filteredByStatusTicketsForTable = this.ticketsForTable.filter((ticket) => ticket['Status'] == '已完成')
    }
    this.dataSource = new MatTableDataSource<any>(filteredByStatusTicketsForTable)
    this.dataSource.paginator = this.paginator
  }

  private filterThePickedTicket(ticketId: string): any {
    return this.ticketsList.filter((ticket) => ticket['TicketId'] == ticketId)
  }

  //needs the ticketId ob with all TPs
  // so we need to loop the array to find the picked ob
  private checkOrderDetails(order): void {
    let pickedTicketId = order['TicketId']
    console.log(pickedTicketId)
    let pickedTicketJsonObj = this.filterThePickedTicket(pickedTicketId)[0]
    // the order is an object not number or string
    const dialogRef = this.dialog.open(OrderConsumerDetailDialogComponent, {
      width: '90%',
      height: '80%',
      data: pickedTicketJsonObj,
    })
  }

  private checkTicketDetails(order): void {
    console.log(order)
    let pickedTicketId = order['TicketId']
    let pickedTicketJsonObj = this.filterThePickedTicket(pickedTicketId)[0]
    // the order is an object not number or string
    const dialogRef = this.dialog.open(OrderTicketProcessDetailDialogComponent, {
      width: '950px',
      height: '600px',
      data: order,
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.getTicketDataFromBackEnd()
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  // only needs ticket Id to shut it
  private toShutTicket(ticket): void {
    //ProcessRecordComponent is to shut the ticket
    const dialogRef = this.dialog.open(OrderTicketCompleteDialogComponent, {
      width: '700px',
      height: '400px',
      data: ticket,
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.getTicketDataFromBackEnd()
    })
  }

  //增加新问题单
  public newTicket(): void {
    const dialogRef = this.dialog.open(OrderTicketNewDialogComponent, {
      width: '850px',
      height: '700px',
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.getTicketDataFromBackEnd()
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }
}
