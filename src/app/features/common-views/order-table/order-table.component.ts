import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute } from '@angular/router'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'
import { tableFilterConsumerSearch } from '../../../core/utils/utils'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { FinanceOrderDialogComponent } from '../../pages/components/finance/orders/finance-order-dialog/finance-order-dialog.component'
import { OrderConsumerDetailDialogComponent } from '../../pages/components/order/order-consumer-detail-dialog/order-consumer-detail-dialog.component'
import { OrderEndpoint } from '../../pages/services/endpoints/order.endpoint'
import { CustomerGroupNameDialogComponent } from '../../pages/components/management/customer-group-management/customer-group-name-dialog/customer-group-name-dialog.component'
import { BatchCancelDialogComponent } from './batch-cancel-dialog/batch-cancel-dialog.component'

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class OrderTableComponent implements OnChanges {
  @Input() tableData: any
  @Input() filterData: any
  @Input() isTrackingInfo = false
  @Input() isHistoryData = false
  @Input() isShowBatchCancelOrder = false
  isShowAction = true
  @Output() outputOrder: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputCin7Order: EventEmitter<any> = new EventEmitter<any>()
  @Input() displayColumns: any = [
    'OrderNo',
    'BillingDate',
    'EnterDate',
    'customer',
    'product',
    'payment',
    'warehouse',
    'Status',
    'Comment1',
    'action',
  ]

  selectedRowIndex = -1

  @Input() userType = null
  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  isPriceVisiable = false
  constructor(
    private sweetAlertService: SweetAlertService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private orderEndpoint: OrderEndpoint,
    private appConfigStore: AppConfigStore
  ) {
    this.isPriceVisiable = this.appConfigStore.isFinancial()
  }

  ngOnChanges(changes): void {
    if (changes.tableData && changes.tableData.currentValue) {
      this.dataSource = new MatTableDataSource()
      this.prepTable()
    }

    if (changes.filterData && changes.filterData.currentValue) {
      this.getFilteredValue(this.filterData)
      console.log(this.filterData)
      console.log(this.dataSource.filteredData)
    }
  }

  batchCancelOrder() {
    if (this.dataSource.filteredData) {
      const orderNoArray = []
      this.dataSource.filteredData.map((row: any) => orderNoArray.push(row.OrderNo))
      console.log(orderNoArray)
      const dialogRef = this.dialog.open(BatchCancelDialogComponent, {})
      dialogRef.componentInstance.outputData.subscribe((result) => {
        if (result) {
          this.orderEndpoint
            ._updateBatchesOrdersReturnStatus({
              Comment: result,
              OrderNos: orderNoArray,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Orders canceled successfully!')
              this.dataSource.data = this.dataSource.data.filter((row: any) => !orderNoArray.includes(row.OrderNo))
            })
        }
      })
    }
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  prepTable() {
    if (this.userType === null) {
      this.route.paramMap.subscribe((paramMap) => {
        this.userType = paramMap.get('usertype')
      })
    }

    // this.displayedColumns = this.isHistoryData
    //   ? [
    //       'order',
    //       'sender',
    //       'recipient',
    //       'product',
    //       'dates',
    //       'customer',
    //       'Cin7InterCode',
    //       'payment',
    //       'status',
    //       'warehouse',
    //       'comments',
    //       'error',
    //       'backupAt',
    //     ]
    //   : [
    //       'order',
    //       'sender',
    //       'recipient',
    //       'product',
    //       'dates',
    //       'customer',
    //       'Cin7InterCode',
    //       'payment',
    //       'status',
    //       'warehouse',
    //       'comments',
    //       'error',
    //       'action',
    //     ]
    if (this.isHistoryData) {
      this.isShowAction = false
    }
    console.log(this.tableData)
    // console.log(this.displayedColumns)

    this.dataSource = new MatTableDataSource(this.tableData)
    this.dataSource.filterPredicate = tableFilterConsumerSearch
    this.dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case 'customer':
          return item['BillingCustomerId']
        case 'product':
          return item['ProductId']
        case 'warehouse':
          return item['StockCustomerId']
        case 'payment':
          return item['OrderPrice']
        default:
          return item[property]
      }
    }
    this.dataSource.sort = this.sort

    this.dataSource.paginator = this.paginator

    // console.log(this.dataSource)
  }

  editThisOrder(order) {
    // this.outputOrder.emit(order)
    const dialogRef = this.dialog.open(OrderConsumerDetailDialogComponent, {
      width: '1100px',
      height: '90%',
      data: order,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.updateNewDataOnSucessUpdateOrderId(order.OrderId)
    })
  }

  editThisOrderFinance(order) {
    const dialogRef = this.dialog.open(FinanceOrderDialogComponent, {
      width: '900px',
      height: '90%',
      data: order,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.updateNewDataOnSucessUpdate(order.OrderNo)
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayColumns, event.previousIndex, event.currentIndex)
  }

  updateNewDataOnSucessUpdate(orderNo) {
    this.orderEndpoint._orderSearchByOrderNo(orderNo).subscribe((res) => {
      this.replaceOldRowData(res[0])
      this.dataSource._updateChangeSubscription()
    })
  }

  updateNewDataOnSucessUpdateOrderId(orderId) {
    this.orderEndpoint._orderSearchByOrderId(orderId).subscribe((res) => {
      this.replaceOldRowData(res[0])
      this.dataSource._updateChangeSubscription()
    })
  }

  replaceOldRowData(newData) {
    console.log(newData)
    console.log(this.tableData)
    for (const index in this.tableData) {
      if (this.tableData[index].OrderId === newData.OrderId) {
        console.log('now')
        this.tableData[index] = newData
        return
      }
    }
  }

  getFilteredValue(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value
      this.outputCin7Order.emit(this.dataSource.filteredData)
      // console.log(this.dataSource.filteredData)
    }
  }

  // emitThisData(data){
  //     console.log(data)
  // }
}
