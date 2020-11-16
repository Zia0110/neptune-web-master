import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ExportExcelComponent } from '../../../../../shared/common-components/export-excel/export-excel.component'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { OrderConsumerDetailDialogComponent } from '../../order/order-consumer-detail-dialog/order-consumer-detail-dialog.component'
import { PickupOrderDialogComponent } from '../warehouse-component/pickup-order-dialog/pickup-order-dialog.component'

@Component({
  selector: 'app-warehouse-pickup-order',
  templateUrl: './warehouse-pickup-order.component.html',
  styleUrls: ['./warehouse-pickup-order.component.css'],
})
export class WarehousePickupOrderComponent implements OnInit {
  /* # 0.variables about Form Control */
  pickupWarehouseFormControl = new FormControl('')
  pickupStockCustomerFormControl = new FormControl('')
  pickupProductFormControl = new FormControl('')
  warehouseValue: number
  warehouseName: string
  stockCustomerValue: number
  productValue: number
  /* # 1.variables about Summary Table */
  SUMMARY_TABLE_DATA = [
    // 2.1所有客户的row
    {
      projectType: '',
      stockSum: 0,
      remainOrderSum: 0,
      selectedSum: 0,
      batchSum: [], // 类型为{info: any; sum: number}[]
      currentSum: 0,
    },
    // 2.2单个客户的row
    {
      projectType: '',
      stockSum: 0,
      remainOrderSum: 0,
      selectedSum: 0,
      batchSum: [], // 类型为{info: any; sum: number}[]
      currentSum: 0,
    },
  ]
  summaryTableDisplayedColumns: string[] = ['projectType', 'stockSum', 'remainOrderSum', 'selectedSum', 'batchSum', 'currentSum']
  summaryTableDataSource = this.SUMMARY_TABLE_DATA
  // 1.3所有客户的订单数组（在Pending Orders里面赋值）
  allCustomerOrders = []
  // 1.4单个客户的订单数组（在Pending Orders里面赋值）
  singleCustomerOrders = []
  /* # 2.variable about detailed table */
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  DETAILED_TABLE_DATA = []
  detailedTableDisplayedColumns: string[] = [
    'position',
    'orderNo',
    'customer',
    'billingCustomer',
    'productCode',
    'productName',
    'comment',
    'warehouse',
    'date',
    'duplicateOrder',
    'add',
  ]
  detailedTableDataSource = new MatTableDataSource(this.DETAILED_TABLE_DATA)
  // 2.1 定义所有批次的array（包括所有不同的product和customer的，应该就在PickupOrdersBatches里面）
  allBatches = []
  // 2.1.1 定义所有批次的OrdersNos的array
  allBatchesOrderNos = []
  // 2.2 定义当前的Batch相关的，后面需要操作。
  currentBatch: any
  isAddMode = true
  isSave = false
  isSaveStatus = false
  multipleNumber: number
  // 2.3 状态保存之后才能切换产品，除了开始进去页面的FirstTime的时候
  isFirstTime = false
  // 是否显示仓库选择框
  isShowWarehouse = true
  // 导出文件的data
  @ViewChild('exportExcel') export: ExportExcelComponent
  excelExportValue = []
  isGenerateExcel = false
  // 全局状态的dialog的data
  allDataTable = []
  // 是否add或者delete
  isChange = false
  // 是否显示清空按钮，在第一次导出文件之前显示
  isShowClearButton = 2 // 2为显示，1为不显示，已存入localstorage
  // 在清空的时候触发
  clearTheContent = true
  // 判断是不是最后一个导出的批次
  isLastExport = false
  isAllExported = 2 // 2为未全导出，1为全导出
  // 判断是否显示保存按钮
  isShowSaveButton = true
  // 是否是第一次进去页面
  isInitPage = false

  constructor(private warehouseEndpoint: WarehouseEndpoint, private sweetAlertService: SweetAlertService, public dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('最开始1')
    this.isFirstTime = true
    if (JSON.parse(localStorage.getItem('isShowClearButton')) === 1) {
      console.log('最开始1.1')
      this.isShowClearButton = 1
    }
    if (JSON.parse(localStorage.getItem('isAllExported')) === 1) {
      console.log('最开始1.2')
      this.isAllExported = 1
    }
    if (JSON.parse(localStorage.getItem('warehouseValue'))) {
      if (JSON.parse(localStorage.getItem('warehouseValue')).warehouseId) {
        if (JSON.parse(localStorage.getItem('warehouseName'))) {
          this.isShowWarehouse = false
        }
        this.warehouseEndpoint
          ._getWarehousesList()
          .toPromise()
          .then((warehouseList: any) => {
            this.warehouseEndpoint
              ._pickupOrderGet({
                warehouseId: JSON.parse(localStorage.getItem('warehouseValue')).warehouseId,
                stockCustomerId: JSON.parse(localStorage.getItem('warehouseValue')).stockCustomerId,
                productId: JSON.parse(localStorage.getItem('warehouseValue')).productId,
              })
              .toPromise()
              .then((res: any) => {
                // 判断是否批次已经全部出库，需要清空localStorage
                if (JSON.parse(localStorage.getItem('isShowClearButton')) === 1) {
                  console.log('最开始2')
                  if (
                    !res.NewPickupOrdersBatches.length &&
                    !res.ExportedPickupOrdersBatches.length &&
                    (!res.OutStockPickupOrdersBatches || !res.OutStockPickupOrdersBatches.length)
                  ) {
                    console.log('最开始3')
                    this.sweetAlertService.successAlert('批次全部已出库，可以进行新一次的挑单！')
                    this.clearAllNewBatches(true)
                    return
                  }
                }
                // 根据api的warehouseId筛选出warehouseList来限制用户重新选择warehouse
                let warehouseName = warehouseList.filter((singleWarehouse) => singleWarehouse.WarehouseId === res.WarehouseId)
                if (!warehouseName.length) {
                  warehouseName = warehouseList.filter(
                    (singleWarehouse) => singleWarehouse.WarehouseId === JSON.parse(localStorage.getItem('warehouseValue')).warehouseId
                  )
                }
                console.log(warehouseName)
                this.warehouseName = warehouseName[0].WarehouseName
                console.log('走onInit。')
                this.pickupWarehouseFormControl.setValue(JSON.parse(localStorage.getItem('warehouseValue')).warehouseId)
                this.pickupStockCustomerFormControl.setValue(JSON.parse(localStorage.getItem('warehouseValue')).stockCustomerId)
                this.pickupProductFormControl.setValue(JSON.parse(localStorage.getItem('warehouseValue')).productId)
                setTimeout(() => {
                  // 当非全部导出时，设置刚进去页面的状态
                  if (this.isAllExported !== 1) {
                    this.isInitPage = true
                  }
                  this.getSummaryTableData()
                })
              })
          })
      }
    }
  }

  /* 重设第一个table的数据 */
  resetSummaryTable() {
    this.SUMMARY_TABLE_DATA = [
      // 2.1所有客户的row
      {
        projectType: '',
        stockSum: 0,
        remainOrderSum: 0,
        selectedSum: 0,
        batchSum: [], // 类型为{info: any; sum: number}[]
        currentSum: 0,
      },
      // 2.2单个客户的row
      {
        projectType: '',
        stockSum: 0,
        remainOrderSum: 0,
        selectedSum: 0,
        batchSum: [], // 类型为{info: any; sum: number}[]
        currentSum: 0,
      },
    ]
    this.summaryTableDisplayedColumns = ['projectType', 'stockSum', 'remainOrderSum', 'selectedSum', 'batchSum', 'currentSum']
    this.summaryTableDataSource = this.SUMMARY_TABLE_DATA
    // 1.3所有客户的订单数组（在Pending Orders里面赋值）
    this.allCustomerOrders = []
    // 1.4单个客户的订单数组（在Pending Orders里面赋值）
    this.singleCustomerOrders = []
  }

  /* # 3.Process the GET api request */
  getSummaryTableData() {
    console.log('此时的isFirstTime和isChange分别为：' + this.isFirstTime + ' ' + this.isChange)
    if (!this.isShowWarehouse && !this.isFirstTime && this.isChange) {
      this.sweetAlertService.showSweetAlert('请先保存状态再切换产品和客户！')
      return
    }
    this.isFirstTime = false
    this.warehouseValue = this.pickupWarehouseFormControl.value
    this.stockCustomerValue = this.pickupStockCustomerFormControl.value
    this.productValue = this.pickupProductFormControl.value
    if (this.warehouseValue && this.stockCustomerValue && this.productValue) {
      // 3.1GET请求api的参数，后面的value遍历里面也会使用到
      const args = {
        warehouseId: this.warehouseValue,
        stockCustomerId: this.stockCustomerValue,
        productId: this.productValue,
      }
      console.log(args)
      // 3.2将GET到的数据编译为string然后存到localStorage
      if (JSON.parse(localStorage.getItem('warehouseValue'))) {
        if (JSON.parse(localStorage.getItem('warehouseValue')).warehouseId === this.warehouseValue) {
          /* ## 3.3为Summary Table赋值 */
          localStorage.setItem('warehouseValue', JSON.stringify(args))
          console.log('localStorage：warehouseValue的args数据已经更新。')
          // 更新新建和导出PickupOrder（用新的GET请求然后覆盖现在的PickupOrders，这样新建、导出、挑单的都能够更新了）
          this.warehouseEndpoint
            ._pickupOrderGet({
              warehouseId: this.warehouseValue,
              stockCustomerId: this.stockCustomerValue,
              productId: this.productValue,
            })
            .toPromise()
            .then((getValue: any) => {
              /* 在客户、产品都选择的情况下 Summary Table更新情况 */
              const pickupGetData = this.getLocalStorageData()
              pickupGetData.NewPickupOrdersBatches = getValue.NewPickupOrdersBatches
              pickupGetData.ExportedPickupOrdersBatches = getValue.ExportedPickupOrdersBatches
              pickupGetData.OutStockPickupOrdersBatches = getValue.OutStockPickupOrdersBatches
              localStorage.setItem('pickupGetData', JSON.stringify(pickupGetData))
              console.log('数据更新到localStorage')
              setTimeout(() => {
                this.setSummaryTable(this.getLocalStorageData(), args)
                this.setDetailedTable()
                this.currentBatch = null
              })
            })
          return
        }
      }
      this.warehouseEndpoint
        ._pickupOrderGet(args)
        .toPromise()
        .then((value: any) => {
          setTimeout(() => {
            this.setSummaryTable(value, args)
            this.setDetailedTable()
          })
          const pickupGetData = JSON.stringify(value)
          localStorage.setItem('pickupGetData', pickupGetData)
          console.log('数据已存入localStorage')
          // warehouseValue相同代表还是上一个挑单，不同代表下一个挑单开始
          localStorage.setItem('warehouseValue', JSON.stringify(args))
        })
    }
  }

  /* # 4.setup the summary table data */
  setSummaryTable(value, args) {
    this.resetSummaryTable()
    let isSetProjectType = false
    // 3.3.1对WarehouseStocks字段的遍历，赋值项目类型、库存总数
    value.WarehouseStocks.map((stock: any) => {
      // 所有的
      if (args.warehouseId === stock.WarehouseId && args.productId === stock.ProductId) {
        this.SUMMARY_TABLE_DATA[0].stockSum += stock.AvaliableStock
        // 单个客户的
        if (args.stockCustomerId === stock.CustomerId) {
          if (!isSetProjectType) {
            if (stock.ProductCode && stock.CustomerCode) {
              this.SUMMARY_TABLE_DATA[0].projectType = stock.ProductCode + ' 订单所有客户汇总'
              this.SUMMARY_TABLE_DATA[1].projectType = stock.ProductCode + ' 订单 ' + stock.CustomerCode + ' 汇总'
              isSetProjectType = true
            }
          }
          this.SUMMARY_TABLE_DATA[1].stockSum += stock.AvaliableStock
        }
      }
    })
    // 3.3.2对PendingOrders字段的遍历，计算出假的remainOrderSum（也是2类订单总数量，暂时记录在remainOrderSum里面）、赋值定义的客户订单数组
    value.PendingOrders.map((order: any) => {
      if (args.productId === order.ProductId) {
        this.SUMMARY_TABLE_DATA[0].remainOrderSum++
        this.allCustomerOrders.push(order)
        if (args.stockCustomerId === order.StockCustomerId) {
          this.SUMMARY_TABLE_DATA[1].remainOrderSum++
          this.singleCustomerOrders.push(order)
        }
      }
    })
    // 3.3.3 第1类已挑、和第1类各批次订单数
    // 3.3.3.1 得出第1类的订单号的数组集合
    const arrayForSelectedAllOrderNos = [] // 后面需要用includes检查，此已挑单是否包括进第1类里面
    this.allCustomerOrders.map((allCusOrder: any) => {
      arrayForSelectedAllOrderNos.push(allCusOrder.OrderNo)
    })
    // 3.3.3.2对2个不同的PickupOrdersBatches遍历，赋值第1类的已挑数、第1类的各批次订单数 (相当于在每个pickup的每个orderNo都判断是不是在allCustomerOrders里面)
    value.NewPickupOrdersBatches.map((newPickup: any) => {
      const newOrderNos = []
      // 精确到每一个pickup
      newPickup.OrderNos.map((orderNo) => {
        if (arrayForSelectedAllOrderNos.includes(orderNo)) {
          newOrderNos.push(orderNo)
        }
      })
      this.SUMMARY_TABLE_DATA[0].batchSum.push({
        info: {
          ...newPickup,
          OrderNos: newOrderNos,
        },
        sum: newOrderNos.length,
      })
      this.SUMMARY_TABLE_DATA[0].selectedSum += newOrderNos.length
    })
    value.ExportedPickupOrdersBatches.map((exportedPickup: any) => {
      const newOrderNos = []
      // 精确到每一个pickup
      exportedPickup.OrderNos.map((orderNo) => {
        if (arrayForSelectedAllOrderNos.includes(orderNo)) {
          newOrderNos.push(orderNo)
        }
      })
      this.SUMMARY_TABLE_DATA[0].batchSum.push({
        info: {
          ...exportedPickup,
          OrderNos: newOrderNos,
        },
        sum: newOrderNos.length,
      })
      this.SUMMARY_TABLE_DATA[0].selectedSum += newOrderNos.length
    })
    /* ### 3.3.4开始为Summary Table的第2行后面几列赋值 */
    // 3.3.4.1所有的第1类已挑订单的数组集合
    const arrayForSelectedAllBatchSumOrderNos = []
    this.SUMMARY_TABLE_DATA[0].batchSum.map((allBatchSumItem: any) => {
      allBatchSumItem.info.OrderNos.map((orderNo: any) => {
        arrayForSelectedAllBatchSumOrderNos.push(orderNo)
      })
    })
    // 3.3.4.2赋值第2类的已挑数
    const arrayForSelectedSingleOrderNos = [] // 单个客户的已挑订单号的数组集合
    this.singleCustomerOrders.map((singleCusOrder: any) => {
      if (arrayForSelectedAllBatchSumOrderNos.includes(singleCusOrder.OrderNo)) {
        this.SUMMARY_TABLE_DATA[1].selectedSum++
        arrayForSelectedSingleOrderNos.push(singleCusOrder.OrderNo)
      }
    })
    // 3.3.4.3赋值第2类的各批次订单数
    this.SUMMARY_TABLE_DATA[0].batchSum.map((allBatchSumItem: any) => {
      // 3.3.4.3.1精确到第一类batchSum数组的每一个Item
      const singleOrderNos = [] // 为了在之前的OrderNos的数组里更新数据，从所有到单个情况的转换。
      allBatchSumItem.info.OrderNos.map((orderNo: any) => {
        // 这里目前的测试数据是length为小于3的订单号数组的遍历
        if (arrayForSelectedSingleOrderNos.includes(orderNo)) {
          singleOrderNos.push(orderNo)
        }
      })
      // 3.3.4.3.2现在这个newAllBatchSumItem的OrderNos已经在这里更新了。（更新了OrderNos和sum）
      const newAllBatchSumItem = {
        info: {
          ...allBatchSumItem.info,
          OrderNos: singleOrderNos,
        },
        sum: singleOrderNos.length,
      }
      this.SUMMARY_TABLE_DATA[1].batchSum.push(newAllBatchSumItem)
    })
    // 3.3.4.4计算出真的remainOrderSum，用订单总数量减去对应类的已挑数
    this.SUMMARY_TABLE_DATA[0].remainOrderSum -= this.SUMMARY_TABLE_DATA[0].selectedSum
    this.SUMMARY_TABLE_DATA[1].remainOrderSum -= this.SUMMARY_TABLE_DATA[1].selectedSum
    // 3.3.4.4对batchSum进行基于batchNo的排序
    this.SUMMARY_TABLE_DATA[0].batchSum.sort((a, b) => a.info.BatchNo - b.info.BatchNo)
    this.SUMMARY_TABLE_DATA[1].batchSum.sort((a, b) => a.info.BatchNo - b.info.BatchNo)
    // ----------------------------结束了第1个table内容的渲染-------------------------------
  }

  /* # 5.设置第2个table的内容（Detailed Table Data） */
  setDetailedTable() {
    this.allBatches = []
    this.allBatchesOrderNos = []
    // 5.1 从localstorage读取数据
    const pickupGetData = this.getLocalStorageData()
    if (!pickupGetData) {
      return
    }
    // 5.2 将pickupGetData.PendingOrders的数据填入第二个table里面
    this.setDetailedTableDataSource(pickupGetData, true)
    // 5.3 设置加入批次
    // 5.3.1遍历3个StockPickupOrdersBatches把content加入到allBatches数组里面、计算出各种batch的数量
    pickupGetData.NewPickupOrdersBatches.map((value) => {
      this.allBatches.push(value)
      value.OrderNos.map((orderNo: any) => this.allBatchesOrderNos.push(orderNo))
    })
    pickupGetData.ExportedPickupOrdersBatches.map((value) => {
      this.allBatches.push(value)
      value.OrderNos.map((orderNo: any) => this.allBatchesOrderNos.push(orderNo))
    })
    if (pickupGetData.OutStockPickupOrdersBatches && pickupGetData.OutStockPickupOrdersBatches.length) {
      pickupGetData.OutStockPickupOrdersBatches.map((value) => {
        this.allBatches.push(value)
      })
    }
    // 5.3.2对allBatches进行基于BatchNo的排序
    this.allBatches.sort((a, b) => a.BatchNo - b.BatchNo)
    console.log(this.allBatches)
    console.log(this.allBatchesOrderNos)
    // 判断是不是刚进去页面，如果是，则先保存一次页面
    if (this.isInitPage) {
      this.isInitPage = false
      this.onSave(true, false)
    }
  }

  /* ## 5.0设置Detailed Table的data source */
  setDetailedTableDataSource(data: any, isInit: boolean, isAdd?, isAllTable?) {
    const PendingOrders = data.PendingOrders
    if (PendingOrders.length) {
      let filterResult
      if (isAllTable) {
        this.allDataTable = []
        filterResult = PendingOrders
        filterResult.map((value: any, index: number) => {
          this.allDataTable.push({
            position: index + 1,
            already: this.allBatchesOrderNos.includes(value.OrderNo) ? 1 : 0,
            orderNo: {
              OrderNo: value.OrderNo,
              OrderId: value.OrderId,
            },
            customer: {
              customerId: value.StockCustomerId,
              customerName: value.StockCustomerCode,
            },
            productCode: {
              productId: value.ProductId,
              productCode: value.ProductCode,
            },
            productName: {
              productId: value.ProductId,
              productName: value.ProductName,
            },
            comment: value.Comment1,
            warehouse: value.RuleName,
            date: value.EnterDate,
          })
        })
        // 这是查看全局状态的data，所以直接返回，不再执行后面的语句
        return
      } else {
        // 配置同名订单和批次
        const newDuplicateOrders = this.setDuplicateOrderArray()
        // 先reset表数据为[]
        this.DETAILED_TABLE_DATA = []
        if (!isInit) {
          if (isAdd) {
            filterResult = PendingOrders.filter((value: any) => {
              if (
                (this.productValue ? value.ProductId === this.productValue : true) &&
                (this.stockCustomerValue ? value.StockCustomerId === this.stockCustomerValue : true)
              ) {
                return true
              }
              return false
            }).filter((value: any) => {
              if (this.allBatchesOrderNos.includes(value.OrderNo)) {
                return false
              }
              return true
            })
          } else {
            filterResult = PendingOrders.filter((value: any) => {
              if (this.currentBatch && this.currentBatch.OrderNos.includes(value.OrderNo)) {
                return true
              }
              return false
            })
          }
        } else {
          // ==**上面的都是Filter，第二个table里面的品名和客户都是需要filter出来**==（在这里Filer）
          filterResult = PendingOrders.filter((value: any) => {
            if (
              (this.productValue ? value.ProductId === this.productValue : true) &&
              (this.stockCustomerValue ? value.StockCustomerId === this.stockCustomerValue : true)
            ) {
              return true
            }
            return false
          })
        }
        filterResult.map((value: any, index: number) => {
          this.DETAILED_TABLE_DATA.push({
            position: index + 1,
            orderNo: {
              OrderNo: value.OrderNo,
              OrderId: value.OrderId,
            },
            customer: {
              customerId: value.StockCustomerId,
              customerName: value.StockCustomerCode,
            },
            billingCustomer: {
              billingCustomerId: value.BillingCustomerId,
              billingCustomerCode: value.BillingCustomerCode,
            },
            productCode: {
              productId: value.ProductId,
              productCode: value.ProductCode,
            },
            productName: {
              productId: value.ProductId,
              productName: value.ProductName,
            },
            comment: value.Comment1,
            warehouse: value.RuleName,
            date: value.EnterDate,
            duplicateOrder:
              newDuplicateOrders &&
              newDuplicateOrders.filter((duplicateOrders) => {
                let isValid = false
                duplicateOrders.map((orderObj) => {
                  if (orderObj.OrderNo === value.OrderNo) {
                    isValid = true
                    return true
                  }
                })
                return isValid
              }).length
                ? newDuplicateOrders.filter((duplicateOrders) => {
                    let isValid = false
                    duplicateOrders.map((orderObj) => {
                      if (orderObj.OrderNo === value.OrderNo) {
                        isValid = true
                        return true
                      }
                    })
                    return isValid
                  })
                : [[]],
            add: {
              position: index + 1,
              orderNo: value.OrderNo,
              warehouseId: value.WarehouseId,
              customerId: value.StockCustomerId,
              productId: value.ProductId,
            },
          })
        })
      }
    }
    this.detailedTableDataSource = new MatTableDataSource(this.DETAILED_TABLE_DATA)
    this.detailedTableDataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case 'orderNo':
          return item.orderNo.OrderNo
        case 'productCode':
          return item.productCode.productCode
        case 'productName':
          return item.productName.productName
        case 'customer':
          return item.customer.customerName
        case 'billingCustomer':
          return item.billingCustomer.billingCustomerCode
        case 'warehouse':
          return item.warehouse.warehouseName
        default:
          return item[property]
      }
    }
    this.detailedTableDataSource.sort = this.sort
    this.detailedTableDataSource.paginator = this.paginator
    this.detailedTableDataSource.filterPredicate = this.createFilter()
  }

  // Generate Excel文件的赋值
  excelExport() {
    const exportDataArray = []
    this.DETAILED_TABLE_DATA.map((i: any) => {
      exportDataArray.push({
        订单号: i['orderNo'].OrderNo,
        品名: i['productName'].productName,
        品名简称: i['productCode'].productCode,
        客户: i['customer'].customerName,
        仓库: i['warehouse'],
        备注: i['comment'],
        批次: this.currentBatch ? '批次' + this.currentBatch.BatchNo : '',
        日期: i['date'],
      })
    })
    this.excelExportValue = exportDataArray
    if (exportDataArray.length) {
      this.isGenerateExcel = true
    }
    console.log(exportDataArray)
  }

  // 打开订单号的dialog
  editThisOrder(order) {
    this.dialog.open(OrderConsumerDetailDialogComponent, {
      width: '91%',
      height: '90%',
      data: order,
    })
  }

  // 打开全局table的dialog
  allInfoTableDialog() {
    const pickupGetData = this.getLocalStorageData()
    if (!pickupGetData) {
      return
    }
    this.setDetailedTableDataSource(pickupGetData, false, false, true)
    const dialogRef = this.dialog.open(PickupOrderDialogComponent, {
      width: '100%',
      height: '97%',
      data: this.allDataTable,
    })
    // 从dialog emit回来的值，如 {productId: 41, customerId: 225, count: 2, already: 0}
    dialogRef.componentInstance.outputData.subscribe((data) => {
      this.pickupStockCustomerFormControl.setValue(data.customerId)
      this.pickupProductFormControl.setValue(data.productId)
      // 是否显示清空按钮，在第一次导出文件之前显示
      this.clearTheContent = false
      // 刷新左上角的三个input和Extract data按钮
      setTimeout(() => {
        this.clearTheContent = true
      })
      this.getSummaryTableData()
    })
  }

  duplicateFunction(value) {
    console.log(value)
  }

  /* 同名订单和批次匹配 */
  setDuplicateOrderArray() {
    if (!this.currentBatch) {
      return
    }
    const duplicateOrders = this.getLocalStorageData().DuplicateOrderNos
    const newDuplicateOrders = []
    duplicateOrders.map((orderGroup) => {
      const newOrderGroup = []
      orderGroup.map((order) => {
        let isMatch = false
        this.allBatches.map((batch) => {
          if (batch.OrderNos && batch.OrderNos.includes(order)) {
            order = {
              OrderNo: order,
              batchNo: batch.BatchNo,
              // 显示当前batch的同名订单数（红色）
              countDuplicateForCurrentBatch: this.currentBatch.OrderNos && this.currentBatch.OrderNos.includes(order) ? 1 : 0,
            }
            newOrderGroup.push(order)
            isMatch = true
          }
        })
        if (!isMatch) {
          order = {
            OrderNo: order,
            batchNo: null,
            countDuplicateForCurrentBatch: 0,
          }
          newOrderGroup.push(order)
        }
      })
      newDuplicateOrders.push(newOrderGroup)
    })
    return newDuplicateOrders
  }

  // 计算当前批次同名订单的数量
  getDuplicateForCurrentbatch(array: any) {
    return array.reduce((acc, cur) => (acc += cur.countDuplicateForCurrentBatch), 0)
  }

  /* ## 5.1读取localStorage的数据 */
  getLocalStorageData() {
    return JSON.parse(localStorage.getItem('pickupGetData'))
  }

  /* # 6.set up current batch */
  setCurrentBatch(batch) {
    if (batch && batch.PickupStatus !== 3) {
      // 根据当前batch的状态判断是否显示保存按钮。如果是导出（状态为2）就不显示，新建（状态为1）就显示
      if (batch.PickupStatus === 2) {
        this.isShowSaveButton = false
      }
      if (batch.PickupStatus === 1) {
        this.isShowSaveButton = true
      }
      this.isGenerateExcel = false
      this.currentBatch = batch
      if (!batch.OrderNos.length) {
        this.setCurrentMode(true)
      } else {
        this.setCurrentMode(false)
      }
      console.log(this.currentBatch)
    }
  }

  /* # 7.set up current mode 查看 或者 增加，通过此方法来Trigger详细table的内容更新 */
  setCurrentMode(isAddMode) {
    this.isAddMode = isAddMode
    console.log(this.isAddMode)
    this.updateDetailedTableContent()
  }

  /* # 8.更新第二个Table的内容 */
  updateDetailedTableContent() {
    const pickupGetData = this.getLocalStorageData()
    // 如果当前为增加模式
    if (this.isAddMode) {
      this.setDetailedTableDataSource(pickupGetData, false, true)
    } else {
      this.setDetailedTableDataSource(pickupGetData, false, false)
      // 调用Generate Excel的方法，赋值data
      this.excelExport()
      console.log(this.DETAILED_TABLE_DATA)
    }
  }

  /* # 9.加入Order到Batch的方法 */
  addOrderToBatch(selectedOrder) {
    console.log(selectedOrder)
    // 更新isSaveStatus
    this.isSaveStatus = false
    // 更新是否更改了状态
    this.isChange = true
    // 更新所有的BatchOrderNos数组allBatchesOrderNos
    this.allBatchesOrderNos.push(selectedOrder.orderNo)
    // 更新currentBatch里面的OrderNos内容
    this.currentBatch.OrderNos.push(selectedOrder.orderNo)
    // 更新allBatches内容(由于this.currentBatch绑定在allBatches里面，所以当curr更新是，allBa自动更新了)
    /* 在客户、产品都选择的情况下 Summary Table更新情况 */
    // 更新SummaryTable的库存数量数据，
    console.log(selectedOrder)
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].stockSum--
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].stockSum--
      }
    }
    // 更新SummaryTable的剩余订单数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].remainOrderSum--
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].remainOrderSum--
      }
    }
    // 更新SummaryTable的已挑数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].selectedSum++
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].selectedSum++
      }
    }
    // 更新SummaryTable的批次数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].batchSum.map((value) => {
        if (value.info.BatchNo === this.currentBatch.BatchNo) {
          // 这里batchSum绑定了自动更新，所以不需要再push
          if (value.info.BatchId) {
            // 对于已状态保存的batch的加
            if (!value.info.OrderNos.includes(selectedOrder.orderNo)) {
              value.info.OrderNos.push(selectedOrder.orderNo)
              value.sum++
              console.log(value)
            }
            return
          } else {
            // 对于刚刚新建的batch的加
            value.sum++
            console.log(value)
            return
          }
        }
      })
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].batchSum.map((value) => {
          if (value.info.BatchNo === this.currentBatch.BatchNo) {
            // 这里batchSum绑定了自动更新，所以不需要再push
            if (value.info.BatchId) {
              // 对于已状态保存的batch的加
              if (!value.info.OrderNos.includes(selectedOrder.orderNo)) {
                value.info.OrderNos.push(selectedOrder.orderNo)
                value.sum++
                console.log(value)
              }
              return
            } else {
              // 对于刚刚新建的batch的加
              value.sum++
              console.log(value)
              return
            }
          }
        })
      }
    }
    // 更新SummaryTable的本次挑单数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].currentSum++
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].currentSum++
      }
    }
    // 更新Detailed Table的content
    this.updateDetailedTableContent()
  }

  /* # 10.删除Order在Batch的方法 */
  deleteOrderToBatch(selectedOrder) {
    console.log(selectedOrder)
    // 更新isSaveStatus
    this.isSaveStatus = false
    // 更新是否更改了状态
    this.isChange = true
    // 更新所有的BatchOrderNos数组allBatchesOrderNos (测试数据有重复数据，所有可能一下减的是2条数据)
    this.allBatchesOrderNos = this.allBatchesOrderNos.filter((orderNo) => orderNo !== selectedOrder.orderNo)
    // 更新currentBatch里面的OrderNos内容
    this.currentBatch.OrderNos = this.currentBatch.OrderNos.filter((orderNo) => orderNo !== selectedOrder.orderNo)
    // 更新allBatches内容(由于this.currentBatch绑定在allBatches里面，所以当curr更新是，allBa自动更新了)
    /* 在客户、产品都选择的情况下 Summary Table更新情况 */
    // 更新SummaryTable的库存数量数据，
    console.log(selectedOrder)
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].stockSum++
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].stockSum++
      }
    }
    // 更新SummaryTable的剩余订单数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].remainOrderSum++
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].remainOrderSum++
      }
    }
    // 更新SummaryTable的已挑数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].selectedSum--
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].selectedSum--
      }
    }
    // 更新SummaryTable的批次数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].batchSum.map((value) => {
        if (value.info.BatchNo === this.currentBatch.BatchNo) {
          // 这里batchSum绑定了自动更新，所以不需要再push
          if (value.info.BatchId) {
            // 对于已状态保存的batch的加
            console.log(value)
            console.log(this.currentBatch)
            if (value.info.OrderNos.includes(selectedOrder.orderNo)) {
              value.info.OrderNos = value.info.OrderNos.filter((orderNo) => orderNo !== selectedOrder.orderNo)
              value.sum--
            }
            return
          } else {
            // 对于刚刚新建的batch的加
            value.sum--
            console.log(value)
            return
          }
        }
      })
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].batchSum.map((value) => {
          if (value.info.BatchNo === this.currentBatch.BatchNo) {
            // 这里batchSum绑定了自动更新，所以不需要再push
            if (value.info.BatchId) {
              // 对于已状态保存的batch的加
              console.log(value)
              console.log(this.currentBatch)
              if (value.info.OrderNos.includes(selectedOrder.orderNo)) {
                value.info.OrderNos = value.info.OrderNos.filter((orderNo) => orderNo !== selectedOrder.orderNo)
                value.sum--
              }
              return
            } else {
              // 对于刚刚新建的batch的加
              value.sum--
              console.log(value)
              return
            }
          }
        })
      }
    }
    // 更新SummaryTable的本次挑单数据
    if (this.productValue && this.productValue === selectedOrder.productId) {
      this.SUMMARY_TABLE_DATA[0].currentSum--
      if (this.stockCustomerValue && this.stockCustomerValue === selectedOrder.customerId) {
        this.SUMMARY_TABLE_DATA[1].currentSum--
      }
    }
    // 更新Detailed Table的content
    this.updateDetailedTableContent()
  }

  /* # 11.批量加入Order到Batch的方法 */
  async addOrderToBatchMultiple(positionNo) {
    if (!this.multipleNumber) {
      this.sweetAlertService.showSweetAlert('请先输入批量处理数量再操作！')
      return
    }
    const saveAlert = await this.sweetAlertService.saveAlert(
      '请注意，您即将批量加入 ' + this.multipleNumber + ' 单到批次 ' + this.currentBatch.BatchNo + '！'
    )
    if (!saveAlert.value) {
      return
    }
    const positionArray = []
    for (let i = 0; i < this.multipleNumber; i++) {
      positionArray.push(positionNo + i)
    }
    const addOrderArray = this.DETAILED_TABLE_DATA.filter((order) => positionArray.includes(order.position))
    addOrderArray.map((value) => this.addOrderToBatch(value.add))
  }

  /* # 12.批量删除Order在Batch的方法 */
  async deleteOrderToBatchMultiple(positionNo) {
    if (!this.multipleNumber) {
      this.sweetAlertService.showSweetAlert('请先输入批量处理数量再操作！')
      return
    }
    const saveAlert = await this.sweetAlertService.saveAlert(
      '请注意，您即将批量删除 ' + this.multipleNumber + ' 单在批次 ' + this.currentBatch.BatchNo + '！'
    )
    if (!saveAlert.value) {
      return
    }
    const positionArray = []
    for (let i = 0; i < this.multipleNumber; i++) {
      positionArray.push(positionNo + i)
    }
    const removeOrderArray = this.DETAILED_TABLE_DATA.filter((order) => positionArray.includes(order.position))
    removeOrderArray.map((value) => this.deleteOrderToBatch(value.add))
  }

  /* # 13.状态保存（调用POSTapi） */
  // isInitStatus：是否是刚进入页面的状态
  // isClear：是否是需要清除批次的状态
  async onSave(isInitStatus, isClear?) {
    if (!isClear && !isInitStatus) {
      if (!this.allBatches.length) {
        this.sweetAlertService.showSweetAlert('请新建批次之后再保存！')
        return
      }
      const saveAlert = await this.sweetAlertService.saveAlert('确认保存吗？')
      if (!saveAlert.value) {
        return
      }
    }
    const postApiData = []
    let isExistNull = false
    this.allBatches.map((value) => {
      if (value.PickupStatus === 1) {
        if (value.OrderNos.length) {
          postApiData.push({
            warehouseId: this.warehouseValue,
            batchNo: value.BatchNo,
            orderNos: value.OrderNos,
          })
        } else {
          isExistNull = true
          this.sweetAlertService.showSweetAlert('请先删除空批次再保存，谢谢！')
        }
      }
    })
    if (!isExistNull) {
      this.warehouseEndpoint
        ._pickupOrderPost(postApiData)
        .toPromise()
        .then((res) => {
          if (isClear) {
            localStorage.removeItem('warehouseValue')
            localStorage.removeItem('warehouseName')
            localStorage.removeItem('pickupGetData')
            localStorage.removeItem('pagiIndex')
            localStorage.removeItem('pagiSize')
            localStorage.removeItem('isShowClearButton')
            localStorage.removeItem('isAllExported')
            this.resetSummaryTable()
            this.isShowWarehouse = true
            this.pickupWarehouseFormControl.reset()
            this.pickupProductFormControl.reset()
            this.pickupStockCustomerFormControl.reset()
            this.clearTheContent = false
            setTimeout(() => {
              this.clearTheContent = true
            })
            this.DETAILED_TABLE_DATA = []
            this.detailedTableDataSource = new MatTableDataSource(this.DETAILED_TABLE_DATA)
            this.currentBatch = null
            this.isAllExported = 2
            this.sweetAlertService.successAlert('可以开始新挑单！')
            return
          }
          this.sweetAlertService.successAlert('Saved successfully！')
          /* 在客户、产品都选择的情况下 Summary Table更新情况 */
          const pickupGetData = this.getLocalStorageData()
          // 更新warehousestocks
          pickupGetData.WarehouseStocks.map((stock: any) => {
            if (this.warehouseValue === stock.WarehouseId && this.productValue === stock.ProductId && this.stockCustomerValue === stock.CustomerId) {
              stock.AvaliableStock = this.SUMMARY_TABLE_DATA[1].stockSum
            }
          })
          // 更新新建和导出PickupOrder（用新的GET请求然后覆盖现在的PickupOrders，这样新建、导出、挑单的都能够更新了）
          this.warehouseEndpoint
            ._pickupOrderGet({
              warehouseId: this.warehouseValue,
              stockCustomerId: this.stockCustomerValue,
              productId: this.productValue,
            })
            .toPromise()
            .then((value: any) => {
              pickupGetData.NewPickupOrdersBatches = value.NewPickupOrdersBatches
              pickupGetData.ExportedPickupOrdersBatches = value.ExportedPickupOrdersBatches
              pickupGetData.OutStockPickupOrdersBatches = value.OutStockPickupOrdersBatches
              localStorage.setItem('pickupGetData', JSON.stringify(pickupGetData))
              this.isSaveStatus = true
              this.isShowWarehouse = false
              this.warehouseEndpoint
                ._getWarehousesList()
                .toPromise()
                .then((warehouseList: any) => {
                  let warehouseName = warehouseList.filter((singleWarehouse) => singleWarehouse.WarehouseId === value.WarehouseId)
                  if (!warehouseName.length) {
                    warehouseName = warehouseList.filter(
                      (singleWarehouse) => singleWarehouse.WarehouseId === JSON.parse(localStorage.getItem('warehouseValue')).warehouseId
                    )
                  }
                  this.warehouseName = warehouseName[0].WarehouseName
                  localStorage.setItem('warehouseName', JSON.stringify(this.warehouseName))
                  console.log('数据更新到localStorage')
                  setTimeout(() => {
                    this.isSave = true
                    // 更新是否更改了状态
                    this.isChange = false
                    this.getSummaryTableData()
                    this.isSave = true
                    this.currentBatch = null
                  })
                  console.log(postApiData)
                })
            })
        })
    }
  }

  /* # 13.生成挑单文件（调用PUTapi） */
  async onExport() {
    const saveAlert = await this.sweetAlertService.saveAlert('确认导出吗？')
    if (!saveAlert.value) {
      return
    }
    if (!this.currentBatch) {
      this.sweetAlertService.showSweetAlert('请先选择批次！')
      console.log(this.currentBatch)
      return
    }
    const localData = this.getLocalStorageData()
    if (localData.NewPickupOrdersBatches.length === 1) {
      const saveAlertNewPickup = await this.sweetAlertService.saveAlert('注意，这是最后一个需要导出的批次，导出之后不能再继续挑单，确定吗？')
      if (!saveAlertNewPickup.value) {
        return
      }
      console.log('最后一个导出批次')
      this.isLastExport = true
    }
    if (this.isSaveStatus && this.isSave) {
      this.warehouseEndpoint
        ._pickupOrderGet({
          warehouseId: this.warehouseValue,
          stockCustomerId: this.stockCustomerValue,
          productId: this.productValue,
        })
        .toPromise()
        .then((res: any) => {
          res.NewPickupOrdersBatches.map((value) => {
            if (value.BatchNo === this.currentBatch.BatchNo) {
              this.warehouseEndpoint
                ._pickupOrderPut(value.BatchId)
                .toPromise()
                .then((sus) => {
                  localStorage.setItem('isShowClearButton', JSON.stringify(1))
                  this.isShowClearButton = 1
                  this.sweetAlertService.successAlert('导出成功！')
                  if (this.isLastExport) {
                    localStorage.setItem('isAllExported', JSON.stringify(1))
                    this.isAllExported = 1
                  }
                  // 更新新建和导出PickupOrder（用新的GET请求然后覆盖现在的PickupOrders，这样新建、导出、挑单的都能够更新了）
                  this.warehouseEndpoint
                    ._pickupOrderGet({
                      warehouseId: this.warehouseValue,
                      stockCustomerId: this.stockCustomerValue,
                      productId: this.productValue,
                    })
                    .toPromise()
                    .then((getValue: any) => {
                      /* 在客户、产品都选择的情况下 Summary Table更新情况 */
                      const pickupGetData = this.getLocalStorageData()
                      pickupGetData.NewPickupOrdersBatches = getValue.NewPickupOrdersBatches
                      pickupGetData.ExportedPickupOrdersBatches = getValue.ExportedPickupOrdersBatches
                      pickupGetData.OutStockPickupOrdersBatches = getValue.OutStockPickupOrdersBatches
                      localStorage.setItem('pickupGetData', JSON.stringify(pickupGetData))
                      console.log('数据更新到localStorage')
                      setTimeout(() => {
                        this.isFirstTime = true
                        this.getSummaryTableData()
                        this.isFirstTime = true
                        this.currentBatch = null
                      })
                    })
                })
            }
          })
        })
    } else {
      this.sweetAlertService.showSweetAlert('请先保存再导出，谢谢！')
    }
  }

  /* 增加新批次 */
  addNewBatch() {
    if (!this.getLocalStorageData()) {
      this.sweetAlertService.showSweetAlert('请先选择挑单仓库！')
      return
    }
    const newBatch = {
      BatchId: null,
      BatchNo: this.allBatches.length ? this.allBatches[this.allBatches.length - 1].BatchNo + 1 : 1,
      PickupStatus: 1,
      PickupStatusName: '新建',
      OrderNos: [],
    }
    // 更新batchSum
    this.SUMMARY_TABLE_DATA[0].batchSum.push({
      info: newBatch,
      sum: newBatch.OrderNos.length,
    })
    this.SUMMARY_TABLE_DATA[1].batchSum.push({
      info: newBatch,
      sum: newBatch.OrderNos.length,
    })
    // 更新allBatches
    this.allBatches.push(newBatch)
    // 更新currentBatch
    this.setCurrentBatch(newBatch)
  }

  /* 删除当前批次 */
  async removeCurrentBatch() {
    if (!this.currentBatch) {
      this.sweetAlertService.showSweetAlert('请先选择批次再删除！')
      return
    }
    if (this.currentBatch.OrderNos.length) {
      this.sweetAlertService.showSweetAlert('请先清空批次再删除！')
    } else {
      const saveAlert = await this.sweetAlertService.saveAlert('请注意，您即将删除批次 ' + this.currentBatch.BatchNo + '！')
      if (!saveAlert.value) {
        return
      }
      // 更新batchSum
      this.SUMMARY_TABLE_DATA[0].batchSum = this.SUMMARY_TABLE_DATA[0].batchSum.filter((batch) => batch.info.BatchNo !== this.currentBatch.BatchNo)
      this.SUMMARY_TABLE_DATA[1].batchSum = this.SUMMARY_TABLE_DATA[1].batchSum.filter((batch) => batch.info.BatchNo !== this.currentBatch.BatchNo)
      // 更新allBatches
      this.allBatches = this.allBatches.filter((batch) => batch.BatchNo !== this.currentBatch.BatchNo)
      // 更新currentBatch
      this.setCurrentBatch(this.allBatches[0])
    }
  }

  /* 清空所有新建的未导出的批次 */
  async clearAllNewBatches(isInitStorage?) {
    if (!isInitStorage) {
      const saveAlert = await this.sweetAlertService.saveAlert('确认清空吗？')
      if (!saveAlert.value) {
        return
      }
    }
    // 清空所有批次里的新建批次
    this.allBatches = []
    console.log(this.allBatches)
    // 保存状态
    this.onSave(false, true)
    // 在onSave方法里面删除localStorage
  }

  /* 对DetailTable的过滤组件 */
  getFilteredValue(value: any) {
    if (this.detailedTableDataSource) {
      console.log(value)
      this.detailedTableDataSource.filter = value
    }
  }

  // 具体的过滤内容和条件
  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: any): boolean => {
      if (data) {
        const searchTerms = JSON.parse(filter)
        return (
          (searchTerms.uploadTextArray.length ? searchTerms.uploadTextArray.includes(data.orderNo.OrderNo) : true) &&
          (searchTerms.orderProductIdSelected ? data.productName.productId === searchTerms.orderProductIdSelected : true) &&
          (searchTerms.orderCustomerIdSelected ? data.billingCustomer.billingCustomerId === searchTerms.orderCustomerIdSelected : true) &&
          (searchTerms.orderStockCustomerIdSelected ? data.customer.customerId === searchTerms.orderStockCustomerIdSelected : true) &&
          (data.position.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.orderNo.OrderNo.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.customer.customerName.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.billingCustomer.billingCustomerCode.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.productCode.productCode.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.productName.productName.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            (data.comment ? data.comment.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 : false) ||
            data.warehouse.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.date.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1)
        )
      }
    }
  }
}
