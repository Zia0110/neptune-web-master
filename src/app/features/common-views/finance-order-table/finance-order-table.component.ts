import { Component, OnChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { tableFilterFinanceOrderAuthorise } from '../../../core/utils/utils'
import { OrderConsumerDetailDialogComponent } from '../../pages/components/order/order-consumer-detail-dialog/order-consumer-detail-dialog.component'
import { FinanceOrderTableEditDialogComponent } from './finance-order-table-edit/finance-order-table-edit-dialog.component'
import { FinanceEndpoint } from '../../pages/services/endpoints/finance.endpoint'
import { FinanceOrderDialogComponent } from '../../pages/components/finance/orders/finance-order-dialog/finance-order-dialog.component'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { OrdersGroupChangeDialogComponent } from '../orders-group-change-dialog/orders-group-change-dialog.component'
import { merge } from 'rxjs'
import { tap } from 'rxjs/operators'
import { OrderEndpoint } from '../../pages/services/endpoints/order.endpoint'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-finance-order-table',
  templateUrl: './finance-order-table.component.html',
  styleUrls: ['./finance-order-table.component.css'],
})
export class FinanceOrderTableComponent implements OnChanges {
  @Input() tableData: any
  @Input() filterData: any
  @Input() suspendedProducts: any
  @Input() displayColumns: any
  orderGroupChanged = false
  @Output() outputOrder: EventEmitter<any> = new EventEmitter<any>()
  @Output() confirmedQtyChange: EventEmitter<number> = new EventEmitter<number>()
  selectedRowIndex: number = -1

  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor(
    private sweetAlertService: SweetAlertService,
    private orderEndpoint: OrderEndpoint,
    public dialog: MatDialog,
    private financeEndpoint: FinanceEndpoint,
    private appConfigStore: AppConfigStore,
    private router: Router
  ) {}

  ngOnChanges(changes): void {
    // console.log(changes)
    if (changes.tableData && changes.tableData.currentValue) {
      this.dataSource = new MatTableDataSource()
      this.prepTable()
    }

    if (changes.filterData && changes.filterData.currentValue) {
      this.getFilteredValue(this.filterData), console.log(this.filterData)
    }
  }

  ngAfterViewInit() {}

  isShowSelfStock(element) {
    if (!element.StockInfos) return false
    return element.StockCustomerId === 446 && element.StockInfos.filter((item) => item.CustomerId === element.BillingCustomerId)[0]
  }

  onChangeCheckbox(event, element) {
    console.log(event)
    console.log(element)
    const newComment3 = event ? (element.Comment3 || '') + '暂扣' : element.Comment3.replace(/暂扣/gi, '')
    this.orderEndpoint
      ._orderSearchByOrderNo(element.OrderNo)
      .toPromise()
      .then((res) => {
        this.financeEndpoint
          ._updateOrderConsumerFinance({
            ...res[0],
            Comment3: newComment3,
          })
          .subscribe((_) => {
            this.sweetAlertService.showSuccessMessage('Successful change！')
            this.getOrderAfterUpdate(element.OrderNo)
          })
      })
  }

  getSelfStock(element) {
    return element.StockInfos.filter((item) => item.CustomerId === element.BillingCustomerId)[0].Sum
  }
  getSelfStock2(element) {
    if (element.StockInfos.length == 0) return 0
    if (element.StockInfos.filter((item) => item.CustomerId === element.BillingCustomerId) == 0) return 0
    return element.StockInfos.filter((item) => item.CustomerId === element.BillingCustomerId)[0].Sum
  }

  prepTable() {
    this.chooseStockCustomerToDisplay(this.tableData)
    // console.log(this.tableData)
    this.dataSource.data = this.tableData
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
        case 'nzdollar':
          return item['Nzd'] ? item['Nzd'] : 0
        case 'SelfStock':
          return this.getSelfStock2(item)
        default:
          return item[property]
      }
    }
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.dataSource.filterPredicate = tableFilterFinanceOrderAuthorise

    // this.dataSource.loadLessons(this.course.id, '', 'asc', 0, 3);

    // console.log(this.dataSource)
  }

  chooseStockCustomerToDisplay(datas) {
    for (let data of datas) {
      this.findSuspendedProducts(data)
      if (data.StockInfos) {
        this.chooseAvailableStock(data)
      }
    }
  }

  chooseAvailableStock(data) {
    data.Stocks = []
    for (let stockInfo of data.StockInfos) {
      if (stockInfo.CustomerId == data.StockCustomerId) {
        // data.Stocks = stockInfo
        data.Stocks.push(stockInfo)
        // return
      }
    }
    if (!data.Stocks.length) {
      data.Stocks.push({ CustomerId: data.StockCustomerId, CustomerName: data.StockCustomerInfo, Alert: '暂无' })
    }
    // Return currently unavilable if no matches
  }

  findSuspendedProducts(data) {
    for (let product of this.suspendedProducts) {
      if (data.ProductId == product.ProductId && data.StockCustomerId == this.appConfigStore.ownerID) {
        return (data['ProductStatus'] = '停卖')
      }
    }
    data['ProductStatus'] = null
  }

  editThisOrder(index, order) {
    this.openDialog(order)
  }

  openDialog(orderData): void {
    const dialogRef = this.dialog.open(FinanceOrderDialogComponent, {
      width: '750px',
      height: '80%',
      data: orderData,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.getOrderAfterUpdate(orderData.OrderNo)
    })
  }

  openGroupEditDialog(): void {
    let dataConcerned = this.dataSource.filteredData
    const dialogRef = this.dialog.open(OrdersGroupChangeDialogComponent, {
      width: '1200px',
      height: '80%',
      data: dataConcerned,
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.changed) {
        this.updateGroupDatas(dataConcerned)
        this.chooseStockCustomerToDisplay(dataConcerned)
        this.orderGroupChanged = true
        this.dataSource._updateChangeSubscription()
      }
    })
  }

  updateGroupDatas(datas) {
    this.orderEndpoint._orderBatchUpdate(datas).subscribe((res) => {
      console.log(res), this.sweetAlertService.showSuccessMessage('Modified Successfully！')
    })
  }

  getOrderAfterUpdate(orderNo) {
    const isCustomerProducts = this.router.url.includes('authorise-customer')
    this.financeEndpoint._getFinanceOrderAuthoriseOrders(isCustomerProducts).subscribe((res: any) => {
      const order = res.RetailOrderDetailInfos.filter((row) => row.OrderNo === orderNo)[0]
      for (let index in this.tableData) {
        if (this.tableData[index].OrderNo == order['OrderNo']) {
          // console.log({data, newOrder})
          this.tableData[index] = { ...this.tableData[index], ...order }
          this.chooseAvailableStock(this.tableData[index])
          this.findSuspendedProducts(this.tableData[index])
          console.log(this.tableData[index])
          break
        }
      }
      this.dataSource._updateChangeSubscription()
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayColumns, event.previousIndex, event.currentIndex)
  }

  getFilteredValue(value: any) {
    if (this.dataSource) {
      setTimeout(() => {
        this.dataSource.filter = value
      }, 500)
    }
  }
  private getconfirmedQty() {
    let count = 0
    for (let order of this.dataSource.filteredData) {
      if (order['IsChecked'] == 1) {
        count++
      }
    }
    return count
  }
  confirmAllOrders(confirm) {
    console.log(this.dataSource)
    for (let order of this.dataSource.filteredData) {
      if (order['IsChecked'] !== 1) {
        if (!order['ProductStatus'] || order['ProductStatus'] != '停卖' || order['OrderPrice']) {
          order['IsChecked'] = confirm
          if (!order['IsChecked']) {
            order['IsApproved'] = 0
          }
        }
      }
    }
    let confirmedQty = this.getconfirmedQty()
    this.confirmedQtyChange.emit(confirmedQty)
  }

  approveAllOrders(approve) {
    console.log(this.dataSource)
    for (let order of this.dataSource.filteredData) {
      if (!order['ProductStatus'] || order['ProductStatus'] != '停卖' || order['OrderPrice']) {
        if (order['IsChecked']) {
          if (!order['CurrentCredit'] || order['CurrentCredit'] > 0) {
            order['IsApproved'] = +approve
            if (order['Comment3'] && order['Comment3'].includes('暂扣')) {
              order['IsApproved'] = 0
            }
          }
        }
      }
    }
  }

  approveCreditProblemOrders(approve) {
    for (let order of this.dataSource.filteredData) {
      if (!order['ProductStatus'] || order['ProductStatus'] != '停卖' || order['OrderPrice']) {
        if (order['IsChecked']) {
          if (order['CurrentCredit'] || order['CurrentCredit'] < 0) {
            order['IsApproved'] = +approve
            if (order['Comment3'] && order['Comment3'].includes('暂扣')) {
              order['IsApproved'] = 0
            }
          }
        }
      }
    }
  }

  confirmOrder(checked, orders) {
    for (let order of orders) {
      if (!order['ProductStatus'] || order['ProductStatus'] != '停卖' || order['OrderPrice']) {
        for (let data of this.tableData) {
          if (order.OrderNo == data.OrderNo) {
            if (data.IsChecked === 1) {
              break
            }
            data.IsChecked = checked

            if (!data.IsChecked) {
              data.IsApproved = 0
            }
            break
          }
        }
      }
    }
    let confirmedQty = this.getconfirmedQty()
    this.confirmedQtyChange.emit(confirmedQty)
    console.log(this.tableData)
  }

  approveOrder(approve, orders) {
    console.log(approve)
    for (let order of orders) {
      if (!order['ProductStatus'] || order['ProductStatus'] != '停卖' || order['OrderPrice']) {
        console.log(order)
        for (let data of this.tableData) {
          console.log(data)
          if (order.OrderNo == data.OrderNo) {
            data.IsApproved = +approve
            if (!data.IsChecked || (data.Comment3 && data.Comment3.includes('暂扣'))) {
              data.IsApproved = 0
            }
            break
          }
        }
      }
    }
    console.log(this.tableData)
  }
}
