import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
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

@Component({
  selector: 'app-inventory-output-management',
  templateUrl: './inventory-output-management.component.html',
  styleUrls: ['./inventory-output-management.component.css'],
})
export class InventoryOutputManagementComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  public displayedColumns: string[] = ['日期', 'INV#', '总和']
  productColumns = []
  ELEMENT_DATA = []
  public dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  isShowTable = true
  selectedBeginDate: string
  selectedEndDate: string
  customerCode: string
  excelExportValue = []
  sumTypeArray = [] // 用于搜集所有类型的array集合

  constructor(
    private inventoryService: InventoryEndpoint,
    public dialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // 计算出当前日期和开始日期（往前推6个月），作为api的参数
    const now = new Date()
    const currentDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const last180days = new Date(now.setDate(now.getDate() - 180))
    const startDateString = `${last180days.getFullYear()}-${last180days.getMonth() + 1}-${last180days.getDate()}`
    console.log('开始日期：' + startDateString)
    console.log('结束日期：' + currentDateString)
    // 配置table的数据
    this.inventoryService
      .GetOverallStockLogsByCustomerId(this.data, startDateString, currentDateString)
      .toPromise()
      .then((res: any) => {
        console.log(res)
        this.customerCode = res.CustomerCode
        this.setTableContent(res.BaseProductOverallStockLogModels)
      })
  }

  // 参数res是api里面的BaseProductOverallStockLogModels的内容
  setTableContent(res: any) {
    if (!res || !res.length) {
      this.sweetAlertService.successAlert('No data for this period！')
      return
    }
    this.ELEMENT_DATA = []
    const dateAndTypeArray = [] // 用于筛选是不是新的一行（过滤日期和类型）
    this.sumTypeArray = []
    res.map((value: any) => {
      // 给Column添加元素
      if (!this.displayedColumns.includes(value.ProductCode)) {
        this.displayedColumns.push(value.ProductCode)
      }
      value.BaseProductOverallStockLogDetailInfos.map((type: any) => {
        const filterResult = dateAndTypeArray.filter((item) => item.Date === type.Date && item.TransactionTypeName === type.TransactionTypeName)
        if (filterResult.length) {
          // 不用新的一行
          this.ELEMENT_DATA.map((rowELEMENT_DATA) => {
            if (rowELEMENT_DATA['日期'] === type.Date && rowELEMENT_DATA['INV#'] === type.TransactionTypeName) {
              // rowELEMENT_DATA[value.ProductCode] = type.TransactionQty
              if (type.TransactionQty) {
                const entry: any = Object.entries(type)
                // 可以通过这个打印来得到所有类型的array
                // console.log(entry)
                for (let i = 3; i <= 9; i++) {
                  if (entry[i][1].length) {
                    // 根据api的column
                    rowELEMENT_DATA[value.ProductCode] = {
                      type: entry[i][0],
                      qty: type.TransactionQty,
                      array: entry[i][1],
                    }
                    rowELEMENT_DATA['总和'] += type.TransactionQty
                    const sumTypeArrayFilterResult = this.sumTypeArray.filter((item) => item.buttonName === type.TransactionTypeName)
                    if (!sumTypeArrayFilterResult.length) {
                      this.sumTypeArray.push({
                        buttonName: type.TransactionTypeName,
                        array: entry[i][1],
                        type: entry[i][0],
                      })
                    } else {
                      this.sumTypeArray.map((itemType) => {
                        if (itemType.buttonName === type.TransactionTypeName) {
                          itemType.array = [...itemType.array, ...entry[i][1]]
                        }
                      })
                    }
                  }
                }
              }
            }
          })
        } else {
          // 新的一行
          const row = {}
          row['总和'] = 0
          row['日期'] = type.Date
          row['INV#'] = type.TransactionTypeName
          // row[value.ProductCode] = type.TransactionQty
          if (type.TransactionQty) {
            const entry: any = Object.entries(type)
            // 可以通过这个打印来得到所有类型的array
            // console.log(entry)
            for (let i = 3; i <= 9; i++) {
              if (entry[i][1].length) {
                // 根据api的column
                row[value.ProductCode] = {
                  type: entry[i][0],
                  qty: type.TransactionQty,
                  array: entry[i][1],
                }
                row['总和'] += type.TransactionQty
                const sumTypeArrayFilterResult = this.sumTypeArray.filter((item) => item.buttonName === type.TransactionTypeName)
                if (!sumTypeArrayFilterResult.length) {
                  this.sumTypeArray.push({
                    buttonName: type.TransactionTypeName,
                    array: entry[i][1],
                    type: entry[i][0],
                  })
                } else {
                  this.sumTypeArray.map((itemType) => {
                    if (itemType.buttonName === type.TransactionTypeName) {
                      itemType.array = [...itemType.array, ...entry[i][1]]
                    }
                  })
                }
              }
            }
          }
          dateAndTypeArray.push({
            Date: type.Date,
            TransactionTypeName: type.TransactionTypeName,
          })
          this.ELEMENT_DATA.push(row)
        }
      })
    })
    console.log(this.sumTypeArray)
    // 更换displayedColumns的顺序
    this.productColumns = this.displayedColumns.filter((column) => column !== '日期' && column !== 'INV#' && column !== '总和')
    this.displayedColumns = ['日期', 'INV#', ...this.productColumns, '总和']
    // 添加table第1个row，和最后一个row
    const beginRow = {}
    beginRow['总和'] = 0
    beginRow['日期'] = ''
    beginRow['INV#'] = '历史库存'
    const endRow = {}
    endRow['总和'] = 0
    endRow['日期'] = 'BALANCE'
    endRow['INV#'] = ''
    this.productColumns.map((column) => {
      const filterResult = res.filter((product) => product.ProductCode === column)
      // console.log(filterResult[0])
      beginRow[column] = {
        type: '',
        qty: filterResult[0] ? filterResult[0].OpeningQty : 0,
        array: [],
      }
      beginRow['总和'] += filterResult[0] ? filterResult[0].OpeningQty : 0
      endRow[column] = {
        type: '',
        qty: filterResult[0] ? filterResult[0].ClosingQty : 0,
        array: [],
      }
      endRow['总和'] += filterResult[0] ? filterResult[0].ClosingQty : 0
    })
    this.ELEMENT_DATA.unshift(beginRow)
    this.ELEMENT_DATA.push(endRow)
    // 默认日期的column排序
    this.ELEMENT_DATA = this.ELEMENT_DATA.sort((a, b) => {
      const dateA = new Date(a['日期'])
      const dateB = new Date(b['日期'])
      if (dateA < dateB) {
        return -1
      }
      if (dateA > dateB) {
        return 1
      }
      // dates must be equal
      return 0
    })
    console.log(this.displayedColumns)
    console.log(this.ELEMENT_DATA)
    // 配置Generate Excel的值
    this.excelExportValue = []
    this.ELEMENT_DATA.map((row) => {
      const excelRow = {}
      excelRow['日期'] = row['日期']
      excelRow['INV#'] = row['INV#']
      this.productColumns.map((item) => {
        if (row[item]) {
          excelRow[item] = row[item].qty
        } else {
          excelRow[item] = ''
        }
      })
      excelRow['总和'] = row['总和']
      // 变换Excel的Column的顺序（改变Object的Orders）
      const newObj = this.sortKeys(excelRow)
      this.excelExportValue.push(newObj)
    })
    console.log(this.excelExportValue)
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
    this.dataSource.paginator = this.paginator
    this.dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case '日期':
          return item['日期']
        case 'INV#':
          return item['INV#']
        case '总和':
          return item['总和']
        default:
          return item[property] ? item[property].qty : 0
      }
    }
    this.dataSource.sort = this.sort
  }

  // Object排序（此方法好像Column不能为数字开头，要不然日期和INV#不能排到前面）
  sortKeys(obj) {
    let key = Object.keys(obj).sort(function order(key1, key2) {
      // tslint:disable-next-line:curly
      if (key1 < key2) return -1
      // tslint:disable-next-line:curly
      else if (key1 > key2) return +1
      // tslint:disable-next-line:curly
      else return 0
    })
    key = key.sort(function order(key1, key2) {
      // tslint:disable-next-line:curly
      if (key1 !== '总和') return -1
      // tslint:disable-next-line:curly
      else return 0
    })
    key = key.sort(function order(key1, key2) {
      // tslint:disable-next-line:curly
      if (key1 === 'INV#') return -1
      // tslint:disable-next-line:curly
      else return 0
    })
    key = key.sort(function order(key1, key2) {
      // tslint:disable-next-line:curly
      if (key1 === '日期') return -1
      // tslint:disable-next-line:curly
      else return 0
    })
    // console.log(key)
    // Taking the object in 'temp' object
    // and deleting the original object.
    const temp = {}
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < key.length; i++) {
      temp[key[i]] = obj[key[i]]
      delete obj[key[i]]
    }
    // console.log(temp)
    // Copying the object from 'temp' to
    // 'original object'.
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < key.length; i++) {
      obj[key[i]] = temp[key[i]]
    }
    return obj
  }

  onSearch() {
    if (!this.selectedBeginDate || !this.selectedEndDate) {
      this.sweetAlertService.showSweetAlert('Please select start date and end date before querying！')
      return
    }
    this.inventoryService
      .GetOverallStockLogsByCustomerId(this.data, this.selectedBeginDate, this.selectedEndDate)
      .toPromise()
      .then((res: any) => {
        this.customerCode = res.CustomerCode
        this.isShowTable = false
        if (res.BaseProductOverallStockLogModels) {
          this.setTableContent(res.BaseProductOverallStockLogModels)
          setTimeout(() => {
            this.isShowTable = true
          })
        } else {
          this.sweetAlertService.successAlert('No data for this period！')
        }
      })
  }

  detailShow(data, type?) {
    if (type) {
      let sumArray = []
      let sumType = ''
      this.productColumns.map((row) => {
        if (data[row]) {
          if (!sumType) {
            sumType = data[row].type
          }
          sumArray = [...sumArray, ...data[row].array]
        }
      })
      // console.log(sumType)
      switch (sumType) {
        case 'RetailOrderNos':
          this.checkSalesOrders(sumArray)
          break
        case 'WholeOrderIds':
          this.checkWholeOrder(sumArray)
          break
        case 'TransportIds':
          this.checkTransport(sumArray)
          break
        case 'PropertyIds':
          this.checkProperty(sumArray)
          break
        case 'PurchaseOrderNos':
          this.checkPurchaseOrders(sumArray)
          break
        case 'TransferApplicationIds':
          this.checkTransferApplication(sumArray)
          break
        case 'SelfGoodsIds':
          this.selfGoods(sumArray)
          break
        default:
          break
      }
      return
    }
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
  public checkSalesOrders(tableHistory: any): void {
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
