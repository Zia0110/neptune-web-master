import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { UploadExcelComponent } from '../../../../../shared/common-components/upload-excel/upload-excel.component'
import { FinanceEndpoint } from '../../../services/endpoints/finance.endpoint'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { TrackingInfoBatchUpdateExcelMapping } from '../../../services/mappings/tracking-info-batch-update-excel-mapping'

@Component({
  selector: 'app-tracking-info-batch-upload',
  templateUrl: './tracking-info-batch-upload.component.html',
  styleUrls: ['./tracking-info-batch-upload.component.css'],
})
export class TrackingInfoBatchUploadComponent implements OnInit {
  orderNoFormControl = new FormControl()
  tableData: any
  filteredValue: any
  tableColumnsAllSelected = false

  constructor(private financeEndpoint: FinanceEndpoint, private sweetAlertService: SweetAlertService, private orderEndpoint: OrderEndpoint) {}

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
    'Comment2',
    'Comment3',
    'TrackingNo',
    'TrackingComments',
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
    { value: 'Comment1', name: 'Comment' },
    { value: 'Comment2', name: 'Comment2' },
    { value: 'Comment3', name: 'Financial Comment' },
    { value: 'TrackingNo', name: 'Tracking No' },
    { value: 'TrackingComments', name: 'Tracking Comments' },
  ]
  isDisableBatchUpload = true
  @ViewChild('uploadExcel') child: UploadExcelComponent
  excelMapping: any
  batchUpdateData = []

  ngOnInit(): void {
    this.excelMapping = new TrackingInfoBatchUpdateExcelMapping()
  }

  excelOutput(event) {
    this.child.reset()
    this.batchUpdateData = this.excelMapping.mapping(event)
    this.financeEndpoint
      ._getBatchUpdateTrackingInfo(this.batchUpdateData)
      .toPromise()
      .then((res: any) => {
        this.tableData = res
        this.isDisableBatchUpload = false
      })
  }

  confirmBatchUpdate() {
    this.financeEndpoint._batchUpdateTrackingInfo(this.batchUpdateData).subscribe((_) => {
      this.sweetAlertService.successAlert('Updated successfully')
      this.isDisableBatchUpload = true
      this.ngOnInit()
    })
  }

  getFilteredValue(value: any) {
    this.filteredValue = value
  }
  toggleAllColumnSelection(allSelectValue) {
    if (!allSelectValue) {
      this.tableColumnDisplaySelection.patchValue([...this.availableColumns.map((item) => item['value'])])
    } else {
      this.tableColumnDisplaySelection.patchValue([])
    }
  }
  getData() {
    if (!this.orderNoFormControl.value) {
      this.sweetAlertService.showSweetAlert('Please enter order number before inquiring！')
      return
    }
    this.orderEndpoint
      ._searchOrderHistory(this.orderNoFormControl.value)
      .toPromise()
      .then((res: any) => {
        const dataArray = []
        dataArray.push(res)
        res.RetailOrderHistories.map((row) => dataArray.push(row))
        this.tableData = dataArray
      })
  }
}
