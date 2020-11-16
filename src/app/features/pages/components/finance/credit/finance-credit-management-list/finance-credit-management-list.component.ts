import { filter } from 'rxjs/operators'
import { Component, OnChanges, Input, ViewChild, ViewEncapsulation, OnInit } from '@angular/core'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import * as moment from 'moment'

@Component({
  selector: 'app-finance-credit-management-list',
  templateUrl: './finance-credit-management-list.component.html',
  styleUrls: ['./finance-credit-management-list.component.css'],
})
export class FinanceCreditManagementListComponent implements OnInit {
  beginDate = moment(new Date()).subtract(6, 'months').format('YYYY-MM-DD')
  endDate = moment(new Date()).format('YYYY-MM-DD')
  clientSelected = new FormControl('')
  creditTypeList = []
  creditType: number = null
  isClosed: number = null
  tableData = []
  excelExportValue: any
  filterString: null
  orginalTableData = []

  constructor(private appConfigStore: AppConfigStore, private sweetAlert: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit() {
    this.clientPickerSub()
    for (let x of this.appConfigStore.appSettings.Mapping.CreditType) {
      let y = {
        value: x.CreditType1,
        view: x.CreditTypeName,
      }
      this.creditTypeList.push(y)
    }
    this.prepareGetApiQueryParams()
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  prepareGetApiQueryParams() {
    let queryParams = ''
    if (this.beginDate && this.endDate) {
      console.log('s')
      queryParams = queryParams.concat('beginDate=' + this.getUTCdate(this.beginDate) + '&endDate=' + this.getUTCdate(this.endDate) + '&')
    }
    if (this.creditType == 0 || this.creditType) {
      queryParams = queryParams.concat('creditTypeId=' + this.creditType + '&')
    }
    if (this.isClosed == 0 || this.isClosed) {
      queryParams = queryParams.concat('isClosed=' + this.isClosed + '&')
    }
    if (this.clientSelected.value && typeof this.clientSelected.value == 'number') {
      queryParams = queryParams.concat('billingCustomerId=' + this.clientSelected.value)
    }
    console.log(queryParams)
    this.getCreditDataApi(queryParams)
  }

  getCreditDataApi(queryParams) {
    this.financeEndpoint._getCreditLists(queryParams).subscribe((res) => {
      console.log(res)
      this.tableData = res as []
      this.orginalTableData = res as []
      this.excelExportValue = this.mapExcelCol(res)
    })
  }
  filter() {
    this.tableData = this.orginalTableData.filter((x) => {
      if (x['NewProductName'] && x['NewProductName'].includes(this.filterString)) return true
      if (x['NewProductCode'] && x['NewProductCode'].includes(this.filterString)) return true
      if (x['OrgProductName'] && x['OrgProductName'].includes(this.filterString)) return true
      if (x['OrgProductCode'] && x['OrgProductCode'].includes(this.filterString)) return true
      if (x['OrgStockCustomerCode'] && x['OrgStockCustomerCode'].includes(this.filterString)) return true
      if (x['OrgStockCustomerName'] && x['OrgStockCustomerName'].includes(this.filterString)) return true
      if (x['NewStockCustomerName'] && x['NewStockCustomerName'].includes(this.filterString)) return true
      if (x['NewStockCustomerCode'] && x['NewStockCustomerCode'].includes(this.filterString)) return true
      if (x['BillingCustomerName'] && x['BillingCustomerName'].includes(this.filterString)) return true
      if (x['BillingCustomerCode'] && x['BillingCustomerCode'].includes(this.filterString)) return true
      if (x['Comment3'] && x['Comment3'].includes(this.filterString)) return true
      if (x['OrderNo'] && x['OrderNo'].includes(this.filterString)) return true
      return false
    })
    this.excelExportValue = this.mapExcelCol(this.tableData)
  }
  private mapExcelCol(data) {
    const ret = []
    data.map((e) => {
      ret.push({
        CreditId: e.CreditId,
        OrderNo: e.OrderNo,
        NewStockCustomerCode: e.NewStockCustomerCode,
        BillingCustomerCode: e.BillingCustomerCode,
        NewProductCode: e.NewProductCode,
        NewOrderPrice: e.NewOrderPrice,
        Credit: e.Credit1,
        CreditType: e.CreditTypeName,
        Comment: e.Comment3,
        CreditNo: e.CreditNo,
        Cin7InvoiceNo: e.Cin7InvoiceNo,
      })
    })
    return ret
  }
  async excelOutput(data) {
    const uploadData = []
    let confirmation = 'You are about to update Credit number'
    for (let e of data) {
      if (e.CreditId == null || e.OrderNo == null || e.CreditNo == null) {
        this.sweetAlert.showSweetAlert('No CreditId or OrderNo or CreditNo')
        return
      }
      confirmation = confirmation + '<div>' + e.OrderNo + ':' + e.CreditNo + '</div>'
      uploadData.push({
        CreditId: e.CreditId,
        OrderNo: e.OrderNo,
        CreditNo: e.CreditNo,
      })
    }
    const confirm = await this.sweetAlert.saveAlertHtml(confirmation)
    if (!confirm.value) return
    this.saveToBack(uploadData)
  }
  saveToBack(uploadData) {
    this.financeEndpoint._updateCreditNo(uploadData).subscribe((res) => {
      console.log(res)
      this.prepareGetApiQueryParams()
    })
  }
  creditTypeSearch($event) {
    console.log($event)
    this.creditType = $event
    this.prepareGetApiQueryParams()
  }

  dateRangePickerOutput($event) {
    console.log($event)
    this.beginDate = $event.begin
    this.endDate = $event.end
    this.prepareGetApiQueryParams()
  }

  isClosedChange(checked) {
    console.log(checked)
    this.isClosed = +checked
    this.prepareGetApiQueryParams()
  }

  clientPickerSub() {
    this.clientSelected.valueChanges.subscribe((res) => {
      setTimeout(() => {
        if (res && typeof res == 'number') this.prepareGetApiQueryParams()
      }, 1500)
    })
  }
}
