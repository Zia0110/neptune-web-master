import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
import { PropertyDialogComponent } from '../inventory-inquiry-dialog/property-dialog/property-dialog.component'
import { PurchaseOrderDialogComponent } from '../inventory-inquiry-dialog/purchase-order-dialog/purchase-order-dialog.component'
import { SelfGoodDialogComponent } from '../inventory-inquiry-dialog/self-good-dialog/self-good-dialog.component'
import { TransferApplicationDialogComponent } from '../inventory-inquiry-dialog/transfer-application-dialog/transfer-application-dialog.component'
import { TransportDialogComponent } from '../inventory-inquiry-dialog/transport-dialog/transport-dialog.component'
import { WholesaleOrderDialogComponent } from '../inventory-inquiry-dialog/wholesale-order-dialog/wholesale-order-dialog.component'
import { InventoryInquiryOrderDetailComponent } from '../inventory-inquiry-order-detail/inventory-inquiry-order-detail.component'
import { TableHistory } from './tableHistory'

@Component({
  selector: 'app-inventory-inquiry-history',
  templateUrl: './inventory-inquiry-history.component.html',
  styleUrls: ['./inventory-inquiry-history.component.css'],
})
export class InventoryInquiryHistoryComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  public curStockId: string
  public displayedColumns: string[] = ['日期', '实际库存']
  ELEMENT_DATA = []
  public dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  isShowTable = true
  selectedBeginDate: string
  selectedEndDate: string
  excelExportValue = []

  constructor(private inventoryService: InventoryEndpoint, public dialog: MatDialog, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.curStockId = this.inventoryService.currentStockId.getValue()
    // 计算出当前日期和开始日期（往前推1个月），作为api的参数
    const now = new Date()
    const currentDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const last180days = new Date(now.setDate(now.getDate() - 180))
    const startDateString = `${last180days.getFullYear()}-${last180days.getMonth() + 1}-${last180days.getDate()}`
    console.log('开始日期：' + startDateString)
    console.log('结束日期：' + currentDateString)
    // 配置table的数据
    this.inventoryService
      .getStockHistoryInfo(this.curStockId, startDateString, currentDateString)
      .toPromise()
      .then((res: any) => {
        console.log(res)
        this.setTableContent(res)
      })
  }

  setTableContent(res: any) {
    this.ELEMENT_DATA = []
    res.map((value: any) => {
      // 定义table每一行的内容
      const row = {}
      const excelRow = {}
      row['日期'] = value.Date
      row['实际库存'] = value.Quantity
      excelRow['日期'] = value.Date.slice(0, 10)
      excelRow['实际库存'] = value.Quantity
      value.StockHistoryTransactionTypeModels.map((type: any) => {
        if (type.TransactionQty) {
          const entry = Object.entries(type)
          // 可以通过这个打印来得到所有类型的array
          // console.log(entry)
          for (let i = 3; i <= 9; i++) {
            if (entry[i][1]) {
              // 根据api的column
              row[type.TransactionTypeName] = {
                type: entry[i][0],
                qty: type.TransactionQty,
                array: entry[i][1],
              }
              excelRow[type.TransactionTypeName] = type.TransactionQty
              if (!this.displayedColumns.includes(type.TransactionTypeName)) {
                this.displayedColumns.push(type.TransactionTypeName)
              }
            }
          }
        }
      })
      this.ELEMENT_DATA.push(row)
      this.excelExportValue.push(excelRow)
    })
    console.log(this.displayedColumns)
    console.log(this.ELEMENT_DATA)
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
    this.dataSource.paginator = this.paginator
    this.dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case '日期':
          return item['日期']
        case '实际库存':
          return item['实际库存']
        default:
          return item[property] ? item[property].qty : 0
      }
    }
    this.dataSource.sort = this.sort
  }

  onSearch() {
    if (!this.selectedBeginDate || !this.selectedEndDate) {
      this.sweetAlertService.showSweetAlert('Please select start date and end date before querying！')
      return
    }
    console.log('开始测试')
    this.inventoryService
      .getStockHistoryInfo(this.curStockId, this.selectedBeginDate, this.selectedEndDate)
      .toPromise()
      .then((res: any) => {
        this.setTableContent(res)
        this.isShowTable = false
        setTimeout(() => {
          this.isShowTable = true
        })
      })
  }

  detailShow(data) {
    if (data) {
      console.log(data)
      switch (data.type) {
        case 'RetailOrderNos':
          this.checkSalesOrders(data.array)
          break
        case 'WholeOrderIds':
          this.checkWholeOrder(data.array)
          break
        case 'TransportIds':
          this.checkTransport(data.array)
          break
        case 'PropertyIds':
          this.checkProperty(data.array)
          break
        case 'PurchaseOrderNos':
          this.checkPurchaseOrders(data.array)
          break
        case 'TransferApplicationIds':
          this.checkTransferApplication(data.array)
          break
        case 'SelfGoodsIds':
          this.selfGoods(data.array)
          break
      }
    }
  }

  dateRangePickerOutput($event) {
    console.log($event)
    this.selectedBeginDate = $event.begin
    this.selectedEndDate = $event.end
  }

  // 零售 订单详情 to use order-table
  public checkSalesOrders(tableHistory: TableHistory): void {
    this.dialog.open(InventoryInquiryOrderDetailComponent, {
      width: '2000px',
      height: '800px',
      data: tableHistory,
    })
  }

  public checkPurchaseOrders(dataTable): void {
    this.dialog.open(PurchaseOrderDialogComponent, {
      width: '2000px',
      height: '800px',
      data: dataTable,
    })
  }

  public checkTransferApplication(dataTable): void {
    this.dialog.open(TransferApplicationDialogComponent, {
      width: '2000px',
      height: '800px',
      data: dataTable,
    })
  }

  public selfGoods(dataTable): void {
    this.dialog.open(SelfGoodDialogComponent, {
      width: '2000px',
      height: '800px',
      data: dataTable,
    })
  }

  public checkTransport(dataTable): void {
    this.dialog.open(TransportDialogComponent, {
      width: '2000px',
      height: '800px',
      data: dataTable,
    })
  }

  public checkProperty(dataTable): void {
    this.dialog.open(PropertyDialogComponent, {
      width: '2000px',
      height: '800px',
      data: dataTable,
    })
  }

  public checkWholeOrder(dataTable): void {
    this.dialog.open(WholesaleOrderDialogComponent, {
      width: '2000px',
      height: '800px',
      data: dataTable,
    })
  }
}
