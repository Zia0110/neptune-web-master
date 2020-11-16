import { tableFilterFinanceOrderAuthorise } from '../../../../../../core/utils/utils'
import { Component, OnInit, ViewChild, ViewChildren, TemplateRef, ElementRef } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { FormControl } from '@angular/forms'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'
import { MatCheckbox } from '@angular/material/checkbox'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import * as moment from 'moment'
import { OrderConsumerExcelExportMapping } from '../../../../services/mappings/order-consumer-excel-export.mapping'
import { UploadExcelComponent } from '../../../../../../shared/common-components/upload-excel/upload-excel.component'
import { FinancialBatchUpdateExcelMapping } from '../../../../services/mappings/financial-batch-update-excel-mapping'
import { Route, Router } from '@angular/router'

@Component({
  selector: 'app-finance-order-authorise',
  templateUrl: './finance-order-authorise.component.html',
  styleUrls: ['./finance-order-authorise.component.css'],
})
export class FinanceOrderAuthoriseComponent implements OnInit {
  confirm = false
  approve = false
  normalOrderData = []
  suspendedOrderData = []
  originData: any
  filteredValue: any
  includeCredits = false
  suspended = []
  data: any
  financeData = null
  creditInfoShow = false
  productInfoShow = false
  tableColumnsAllSelected = false
  exportExcelData = {}
  @ViewChild('excelExporter') excelExporter
  @ViewChild('financeTable') financeTable
  customerArray = []
  @ViewChild('uploadExcel') child: UploadExcelComponent
  isDisableBatchUpload = true
  comfirmedQty = 0

  tableColumnDisplaySelection = new FormControl([
    'OrderNo',
    'BillingDate',
    'customer',
    'product',
    'payment',
    'nzdollar',
    'warehouse',
    'Comment3',
    'ProductCheck',
    'SelfStock',
    'action',
    'IsChecked',
    'IsApproved',
  ])

  availableColumns = [
    { value: 'OrderNo', name: 'Order Number' },
    { value: 'Reference', name: 'Order Reference' },
    { value: 'Cin7InvoiceNo', name: 'Cin7 Invoice No' },
    { value: 'sender', name: 'Sender' },
    { value: 'recipient', name: 'Recipient' },
    { value: 'EnterDate', name: 'Entry Date' },
    { value: 'BillingDate', name: 'Financial date' },
    { value: 'customer', name: 'Client' },
    { value: 'product', name: 'Product' },
    { value: 'payment', name: 'Payment Info' },
    { value: 'nzdollar', name: 'NZ Dollar' },
    { value: 'warehouse', name: 'Warehouse Info' },
    { value: 'Cin7InterCode', name: 'Cin7 Inter Code' },
    { value: 'Comment1', name: 'Comment' },
    { value: 'Comment2', name: 'Comment2' },
    { value: 'Comment3', name: 'Financial Comment' },
    { value: 'ProductCheck', name: 'Product Check' },
    { value: 'SelfStock', name: 'Self Stock' },
    { value: 'action', name: 'Action' },
    { value: 'IsChecked', name: 'Confirmation' },
    { value: 'IsApproved', name: 'Approve' },
  ]
  orderExportMapping: OrderConsumerExcelExportMapping
  excelMapping: any
  batchUpdateData = []
  isCustomerProducts = false

  constructor(
    private router: Router,
    private appConfigStore: AppConfigStore,
    private financeEndpoint: FinanceEndpoint,
    private sweetAlertService: SweetAlertService
  ) {
    this.isCustomerProducts = this.router.url.includes('authorise-customer')
  }

  ngOnInit() {
    this.getOrdersDataApi()
    this.columnSettingsControl()
    this.excelMapping = new FinancialBatchUpdateExcelMapping()
  }

  excelOutput(event) {
    this.child.reset()
    this.batchUpdateData = this.excelMapping.mapping(event)
    this.financeEndpoint
      ._getBatchUpdateRetailOrdersPriceAndComment3(this.batchUpdateData)
      .toPromise()
      .then((res: any) => {
        this.normalOrderData = res
        this.isDisableBatchUpload = false
      })
  }

  confirmBatchUpdate() {
    this.financeEndpoint._batchUpdateRetailOrdersPriceAndComment3(this.batchUpdateData).subscribe((_) => {
      this.sweetAlertService.successAlert('Updated successfully')
      this.isDisableBatchUpload = true
      this.ngOnInit()
    })
  }

  columnSettingsControl() {
    let x = JSON.parse(localStorage.getItem('financeTableColumns'))

    if (x && x.length) {
      this.tableColumnDisplaySelection.setValue(x)
    }

    this.tableColumnDisplaySelection.valueChanges.subscribe((res) => {
      setTimeout(() => {
        if (this.tableColumnDisplaySelection.value.length)
          localStorage.setItem('financeTableColumns', JSON.stringify(this.tableColumnDisplaySelection.value))
      }, 5000)
    })
  }

  toggleAllColumnSelection(allSelectValue) {
    if (!allSelectValue) {
      this.tableColumnDisplaySelection.patchValue([...this.availableColumns.map((item) => item['value'])])
    } else {
      this.tableColumnDisplaySelection.patchValue([])
    }
  }

  // Get api data
  getOrdersDataApi() {
    this.financeEndpoint._getFinanceOrderAuthoriseOrders(this.isCustomerProducts).subscribe((res) => {
      console.log(res)
      if (res['RetailOrderDetailInfos'].length == 0) this.sweetAlertService.showSuccessMessage('No order')
      else {
        this.data = res
        setTimeout(() => this.dataPrep(res), 300)
      }
    })
  }

  dataPrep(data) {
    let orders = data.RetailOrderDetailInfos
    // console.log(orders)
    let creditsProblems = []
    data.CustomerCredits.forEach((element) => {
      if (element.Balance < 0) creditsProblems.push(element)
    })

    if (creditsProblems.length) {
      for (let credits of creditsProblems) {
        credits['Orders'] = 0
        for (let order of orders) {
          // if (order.StockCustomerId == this.appConfigStore.ownerID) {
          if (credits.CustomerId == order.BillingCustomerId) {
            order['CurrentCredit'] = credits.Balance
            credits['Orders']++
          }
          // }
        }
      }
    }

    let newSuspended = data.SuspenedProducts.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj['ProductId']).indexOf(obj['ProductId']) === pos
    })
    console.log(newSuspended)

    let ordersWithInvalidProducts = []
    if (newSuspended.length) {
      for (let product of newSuspended) {
        product['Orders'] = 0
        for (let orderKey in orders) {
          if (product.ProductId == orders[orderKey]['ProductId'] && orders[orderKey]['StockCustomerId'] == this.appConfigStore.ownerID) {
            product['Orders']++
          }
        }
      }
      // this.suspendedOrderData = ordersWithInvalidProducts
    }

    this.suspended = newSuspended
    this.normalOrderData = orders
    const customerIdArray = []
    this.customerArray = []
    this.normalOrderData.map((row) => {
      if (!customerIdArray.includes(row.BillingCustomerId)) {
        this.customerArray.push({
          id: row.BillingCustomerId,
          customerString: row.CustomerString,
          firstName: row.FirstName,
        })
        customerIdArray.push(row.BillingCustomerId)
      }
    })
    console.log(customerIdArray)
    console.log(this.customerArray)
    this.financeData = { creditInfo: creditsProblems, productInfo: newSuspended }
  }

  initObjects() {
    this.normalOrderData = []
    this.suspendedOrderData = []
    this.getOrdersDataApi()
  }

  creditChange() {
    console.log(this.includeCredits)
    this.financeTable.approveCreditProblemOrders(this.includeCredits)
  }

  markAllCheck() {
    // console.log(this.includeCredits)
    // this.confirm = !this.confirm
    this.financeTable.confirmAllOrders(this.confirm)
  }

  markAllApprove() {
    // this.approve = !this.approve
    this.financeTable.approveAllOrders(this.approve)
  }

  saveDataToApi() {
    // console.log(this.financeTable.tableData)
    if (!this.financeTable.tableData) this.sweetAlertService.showSweetAlert('No Changes')

    let newData = this.cleanData(this.financeTable.tableData)
    console.log(newData)
    // return;

    this.financeEndpoint._updateOrdersConsumerFinanceApproved(newData).subscribe((res) => {
      console.log(res), this.sweetAlertService.showSuccessMessage('Saved')
      this.confirm = false
      this.approve = false
      this.initObjects()
    })
  }

  cleanData(datas) {
    for (let data of datas) {
      // let data = datas[1]
      if (data.StockInfos) {
        delete data.StockInfos
      }
      if (data.NewPrice) {
        delete data.NewPrice
      }
      data.IsChecked = +data.IsChecked
      if (data.IsChecked === 1) {
        data.Status = 3
      }

      if (data.IsApproved === 1 && data.IsChecked === 1) {
        data.Status = 4
      }
    }
    return datas
  }

  passFilteredValue($event) {
    this.filteredValue = $event
  }

  exportToExcel() {
    this.orderExportMapping = new OrderConsumerExcelExportMapping(this.appConfigStore)

    let name = 'financial approval' + moment().format('YYYY-MM-DD')
    let dataExport = this.orderExportMapping.mapping(this.financeTable.dataSource.filteredData)

    this.exportExcelData = dataExport

    setTimeout(() => {
      this.excelExporter.exportAsXLSX(name)
    }, 400)
  }
  updateConfirmedQty(e) {
    this.comfirmedQty = e
  }
}
