import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { BulkStockCustomerUpdateMapping } from '../../../services/mappings/bulk-stockcustomer-update-mapping'
import { MatTabGroup } from '@angular/material/tabs'
import { ActivatedRoute } from '@angular/router'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { OrdersGroupChangeDialogComponent } from '../../../../common-views/orders-group-change-dialog/orders-group-change-dialog.component'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { OrderConsumerExcelExportMapping } from '../../../services/mappings/order-consumer-excel-export.mapping'
import { PagesRepository } from '../../../services/repository/pages.repository'
import { AppConfigStore } from './../../../../../core/services/app-config.store'
import { TableHistory } from '../../inventory/inventory-inquiry-history/tableHistory'
import { InventoryInquiryOrderDetailComponent } from '../../inventory/inventory-inquiry-order-detail/inventory-inquiry-order-detail.component'
import { tableFilterConsumerSearch } from '../../../../../core/utils/utils'

@Component({
  selector: 'app-order-consumer-search',
  templateUrl: './order-consumer-search.component.html',
  styleUrls: ['./order-consumer-search.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderConsumerSearchComponent implements OnInit {
  batchDatas = []
  selected = new FormControl(0)
  filteredValue: any
  orderStatusList = []
  orderNumSearchInput = new FormControl()
  cin7NoSearchInput = new FormControl()
  outStockBatchQuery = new FormControl()
  exportExcelData = {}
  orderExportMapping: any
  outStockBatchArray: any
  outStockAllSelected = false
  currentOutStockBatchQuery: any
  tableColumnsAllSelected = false

  tableColumnDisplaySelection = new FormControl([
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
  ])

  availableColumns = [
    { value: 'OrderNo', name: 'Order number' },
    { value: 'Reference', name: 'Order Ref' },
    { value: 'Cin7InvoiceNo', name: 'Cin7 Invoice No.' },
    { value: 'sender', name: 'Sender' },
    { value: 'recipient', name: 'Recipient' },
    { value: 'EnterDate', name: 'Enter Date' },
    { value: 'BillingDate', name: 'Financial Date' },
    { value: 'customer', name: 'customer' },
    { value: 'product', name: 'product' },
    { value: 'payment', name: 'payment information' },
    { value: 'warehouse', name: 'Warehouse Information' },
    { value: 'Status', name: 'Order Status' },
    { value: 'Cin7InterCode', name: 'Cin7 InterCode' },
    { value: 'Comment1', name: 'Comment1' },
    { value: 'Comment2', name: 'Comment2' },
    { value: 'Comment3', name: 'Financial Comment' },
    { value: 'DispatchComment', name: 'Repository Notes' },
    { value: 'action', name: 'Change' },
  ]

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup
  @ViewChildren('tables') tables
  @ViewChild('excelExporter') excelExporter
  userType: string

  constructor(
    public dialog: MatDialog,
    private orderEndpoint: OrderEndpoint,
    private sweetAlertService: SweetAlertService,
    public _appConfigStore: AppConfigStore,
    private cdr: ChangeDetectorRef,
    private pageRepository: PagesRepository,
    private route: ActivatedRoute
  ) {}

  getLocateDateString(date) {
    return new Date(date.replace('T', ' ') + ' UTC')
  }

  toggleAllColumnSelection(allSelectValue) {
    if (!allSelectValue) {
      this.tableColumnDisplaySelection.patchValue([...this.availableColumns.map((item) => item['value'])])
    } else {
      this.tableColumnDisplaySelection.patchValue([])
    }
  }

  toggleAllSelection(control, allSelectValue) {
    if (!allSelectValue) {
      this.outStockBatchQuery.patchValue([...this.outStockBatchArray.map((item) => item['OutStockBatchId'])])
    } else {
      this.outStockBatchQuery.patchValue([])
    }
  }

  ngOnInit() {
    this.orderStatusList = this._appConfigStore.orderStatusSelectionList
    this.initSearchParams()
    this.columnSettingsControl()
    this.orderExportMapping = new OrderConsumerExcelExportMapping(this._appConfigStore)
    this.route.paramMap.subscribe((paramMap) => {
      this.userType = paramMap.get('usertype')
    })
  }

  bulkProductModify() {
    const filteredOrders = this.tables._results[0].dataSource.filteredData
    const orderNos = []
    filteredOrders.map((row) => {
      orderNos.push(row.OrderNo)
    })
    if (orderNos && orderNos.length) {
      this.orderEndpoint
        ._ReGetRetailOrderMappingInfo(orderNos)
        .toPromise()
        .then((res: any) => {
          console.log(res)
          const orders = [
            ...res.RetailOrderAbnomalModel.RetailOrderCustomerAbnormalInfos,
            ...res.RetailOrderAbnomalModel.RetailOrderProductAbnormalInfos,
          ]
          if (orders && orders.length) {
            this.sweetAlertService.showSweetAlert('订单信息不正确，包括异常数据，请重新选择！')
            return
          }
          const normalOrders = []
          res.RetailOrderNomalModel.map((row) => {
            normalOrders.push(row.RetailOrderDto)
          })
          console.log(normalOrders)
          this.dialog.open(InventoryInquiryOrderDetailComponent, {
            width: '2000px',
            height: '800px',
            data: {
              type: 'bulkProductModify',
              data: normalOrders,
            },
          })
        })
    }
  }

  columnSettingsControl() {
    const x = JSON.parse(localStorage.getItem('orderTableColumns'))

    if (x && x.length) {
      this.tableColumnDisplaySelection.setValue(x)
    }

    this.tableColumnDisplaySelection.valueChanges.subscribe((res) => {
      setTimeout(() => {
        if (this.tableColumnDisplaySelection.value.length)
          localStorage.setItem('orderTableColumns', JSON.stringify(this.tableColumnDisplaySelection.value))
      }, 5000)
    })
  }

  outStockBatchTrigger($event) {
    if ($event) return
    if (this.outStockBatchQuery.value && this.outStockBatchQuery.value.length && this.outStockBatchQuery.value != this.currentOutStockBatchQuery) {
      const displayName = '出库批次 '
      this.currentOutStockBatchQuery = this.outStockBatchQuery.value
      this.getApiOrdersByOutBatch(this.outStockBatchQuery.value, displayName)
    }
  }

  initSearchParams() {
    if (this.pageRepository.orderSearchQueryParams) {
      if (this.pageRepository.orderSearchQueryParams.orderNums) {
        this.getApiOrderByOrderNumArray(this.pageRepository.orderSearchQueryParams.orderNums)
      }
    }
  }

  tabNavigate() {
    if (!this.tabs || !(this.tabs instanceof MatTabGroup)) return

    const tabCount = this.tabs._tabs.length

    this.tabs['_indexToSelect'] = tabCount
    this.cdr.detectChanges()

    console.log(this.tabs)
  }

  orderNumSearch() {
    if (!this.orderNumSearchInput.value) return
    this.getApiOrderByOrderNum(this.orderNumSearchInput.value)
  }

  passFilteredValue($event) {
    this.filteredValue = $event
    console.log(typeof this.filteredValue)
    this.filteredValue = JSON.parse(this.filteredValue)
    // console.log(this.filteredValue.uploadTextArray)
    // this.checkSalesOrders(this.filteredValue.uploadTextArray)
    // this.filteredValue['uploadTextArray'] = []
    // console.log(typeof this.filteredValue)
    console.log(this.filteredValue)
    this.filteredValue = JSON.stringify(this.filteredValue)
    console.log(this.filteredValue)
  }

  public checkSalesOrders(tableHistory: TableHistory): void {
    this.dialog.open(InventoryInquiryOrderDetailComponent, {
      width: '2000px',
      height: '800px',
      data: tableHistory,
    })
  }

  orderStatusSearch(event) {
    console.log(event)
    this.getApiOrdersByStatus(event)
  }

  // Output for datapicker
  datepickerOutput(event) {
    console.log(event)
    console.log(this.getUTCdate(event))
    const displayName = '导入' + event
    this.getApiHistoricalImports(this.getUTCdate(event), displayName)
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  dateRangePickerOutput($event) {
    // console.log($event)
    const qp = 'beginDate=' + this.getUTCdate($event.begin) + '&endDate=' + this.getUTCdate($event.end)
    const displayName = '出库' + $event.begin + '到' + $event.end
    console.log(qp)
    this.getApiStockOutBatchByDate(qp, displayName)
  }

  financeDateRangePickerOutput($event) {
    // console.log($event)
    const qp = 'beginDate=' + this.getUTCdate($event.begin) + '&endDate=' + this.getUTCdate($event.end)
    const displayName = $event.begin + '到' + $event.end
    console.log(qp)
    this.orderEndpoint._orderSearchByFinanceRange(qp).subscribe((res: any) => {
      if (!res.length) {
        this.sweetAlertService.showSuccessMessage('现在没有 这些订单')
        return
      }
      if (res['length']) {
        this.batchDatas.push({ name: 'Finance Date', orders: res })
        //  this.tabNavigate()
        console.log(this.batchDatas)
      } else {
        this.batchDatas.push([{ name: 'Finance Date', orders: res }]), this.tabNavigate()
      }
    })
  }

  getApiOrderByOrderNumArray(orderNumArray) {
    this.orderEndpoint._orderSearchByOrderArray(orderNumArray).subscribe((res) => {
      if (res['length']) {
        this.batchDatas.push({ name: '订单号', orders: res })
        // this.tabNavigate()
        console.log(this.batchDatas)
      } else this.sweetAlertService.showSuccessMessage('现在没有 这些订单')
    })
  }

  getApiOrderByOrderNum(orderNum) {
    this.orderEndpoint._orderSearchByOrderNo(orderNum).subscribe((res) => {
      if (res['length']) {
        this.batchDatas.push({ name: orderNum, orders: res })
        //  this.tabNavigate()
        console.log(this.batchDatas)
      } else {
        this.batchDatas.push([{ name: orderNum, orders: res }]), this.tabNavigate()
      }
    })
  }

  getApiOrdersByStatus(status) {
    this.orderEndpoint._getOrdersConsumerByStatus(status).subscribe((res) => {
      if (res['length']) {
        const ss = res[0].StatusName
        this.batchDatas.push({ name: ss, orders: res }), this.tabNavigate()
        console.log(this.batchDatas)
      } else this.sweetAlertService.showSuccessMessage('现在没有 这种订单状态')
    })
  }

  getApiHistoricalImports(searchParams, displayName) {
    this.orderEndpoint._ordersConsumerImportSearch(searchParams).subscribe((res) => {
      if (res['length']) {
        console.log(res)
        this.prepHistocalImportsData(res, displayName)
      } else this.sweetAlertService.showSuccessMessage('No order data for that day')
    })
  }

  prepHistocalImportsData(datas, displayName) {
    for (const data of datas) {
      if (data.RetailOrder.length) {
        this.batchDatas.push({ name: displayName, orders: data.RetailOrder })
      }
    }
    this.tabNavigate()
    console.log(this.batchDatas)
  }

  getApiStockOutBatchByDate(qp, displayName) {
    this.orderEndpoint._getOutStockBatchByDate(qp).subscribe((res) => {
      console.log(res)
      if (res['length']) {
        this.outStockBatchArray = res
      } else {
        this.sweetAlertService.showSuccessMessage('No order data for that day')
      }
    })
  }

  getApiOrdersByOutBatch(datas, displayName) {
    const qp =
      'outstockBatchId=' +
      datas
        .map((data) => {
          return data
        })
        .join('&outstockBatchId=')
    console.log(qp)
    this.orderEndpoint._getOutStockOrdersByBatch(qp).subscribe((res) => {
      console.log(res)
      if (res['length']) {
        const newDisplayname = displayName + res[0].WarehouseName
        this.batchDatas.push({ name: newDisplayname, orders: res }), this.tabNavigate()
        console.log(this.batchDatas)
      } else {
        this.sweetAlertService.showSuccessMessage('No order data for that day')
      }
    })
  }

  cin7NumSearch() {
    console.log(this.cin7NoSearchInput)
    if (!this.cin7NoSearchInput.value) return
    this.getApiOrdersByCin7ImportNo(this.cin7NoSearchInput.value)
  }

  getApiOrdersByCin7ImportNo(cin7No) {
    this.orderEndpoint._getOrdersByCin7ImportNo(cin7No).subscribe((res) => {
      if (!res['length']) this.sweetAlertService.showSuccessMessage('Cin7 has no order data')
      else {
        this.batchDatas.push({ name: 'Cin7号 ' + cin7No, orders: res })
        this.tabNavigate()
      }
    })
  }

  exportToExcel() {
    const currentData = this.tabs.selectedIndex
    console.log(currentData)

    console.log(this.batchDatas[currentData])

    const name = this.batchDatas[currentData].name

    // const filterData = this.batchDatas[currentData].orders.filter(e=> tableFilterConsumerSearch.call(null,e,this.filteredValue));

    const dataExport = this.orderExportMapping.mapping(this.tables._results[0].dataSource.filteredData)

    this.exportExcelData = dataExport

    setTimeout(() => {
      this.excelExporter.exportAsXLSX('订单导出-' + name)
    }, 400)
  }

  openGroupEditDialog() {
    console.log(this.tables)
    let dataConcerned = this.tables._results[0].dataSource.filteredData
    console.log(dataConcerned)
    const dialogRef = this.dialog.open(OrdersGroupChangeDialogComponent, {
      width: '1200px',
      height: '80%',
      data: dataConcerned,
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.changed) {
        this.orderEndpoint._orderBatchUpdate(dataConcerned).subscribe((res) => {
          console.log(res)
          this.sweetAlertService.showSuccessMessage('Successfully changed！')
        })
      }
      // if(result && result.changed){
      //   this.chooseStockCustomerToDisplay(this.dataSource.filteredData)
      //   this.orderGroupChanged = true
      //   this.dataSource._updateChangeSubscription()
    })
  }

  removeTab(index: number) {
    this.batchDatas.splice(index, 1)
  }
  async excelOutput(event) {
    const excelMapping = new BulkStockCustomerUpdateMapping()
    if (!this.tables._results[0]) {
      this.sweetAlertService.showSweetAlert('There is no order in table, Please search first!')
      return
    }
    if (this.tables._results[0].dataSource.filteredData.length == 0) {
      this.sweetAlertService.showSweetAlert('There is no order in table, Please search first!')
      return
    }

    const importData = excelMapping.mapping(event)
    let confirmation = '<div>Do you want update all the orders in excel?</div>'
    importData.map((e) => {
      confirmation = confirmation + '<div>'
      confirmation = confirmation + e.OrderNo
      confirmation = confirmation + ':'
      confirmation = confirmation + e.StockCustomerCode
      confirmation = confirmation + '</div>'
    })
    const confirm = await this.sweetAlertService.saveAlertHtml(confirmation)
    if (!confirm.value) return
    const orders = this.dataToTable(importData)
    if (event.length != orders.length) {
      this.sweetAlertService.showSweetAlert('There is an error in format, Please check!')
      return
    }
    const errOrderNo = []
    orders.map((e) => {
      if (e.totalPrice == null) errOrderNo.push(e.orderNo)
    })
    if (errOrderNo.length > 0) {
      this.sweetAlertService.showSweetAlert(errOrderNo.join(',') + ' do not have a price!')
      return
    }
    this.saveBulkUpdateStock(orders)
  }
  private saveBulkUpdateStock(orders) {
    this.orderEndpoint._orderBatchUpdate(orders).subscribe((res) => {
      console.log(res)
      this.sweetAlertService.showSuccessMessage('Successfully updated,Please search again!')
    })
  }
  private dataToTable(importedData) {
    const updateOrders = []
    for (let e of importedData) {
      let customer = this.getCustomerIdforCode(e.StockCustomerCode)
      if (!customer) {
        this.sweetAlertService.showSweetAlert('There is an error in customer code mapping')
        continue
      }
      let packPost = this.packPost(e.OrderNo)
      packPost.stockCustomerId = customer.CustomerId
      updateOrders.push(packPost)
    }
    return updateOrders
  }
  packPost(orderNo) {
    const tableData = this.tables._results[0].dataSource.filteredData
    const foundRow = tableData.find((e) => e.OrderNo == orderNo)
    return {
      orderNo: orderNo,
      productId: foundRow.ProductId,
      orderPrice: foundRow.OrderPrice,
      totalPrice: foundRow.TotalPrice,
      stockCustomerId: 0,
    }
  }
  private getCustomerIdforCode(code) {
    return this._appConfigStore.appSettings.CustomerInfo.Customers.find((e) => e.CustomerCode == code)
  }
}
