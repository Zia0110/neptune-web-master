import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'

@Component({
  selector: 'app-order-history-search',
  templateUrl: './order-history-search.component.html',
  styleUrls: ['./order-history-search.component.css'],
})
export class OrderHistorySearchComponent implements OnInit {
  orderNoFormControl = new FormControl()
  tableData: any
  filteredValue: any
  tableColumnsAllSelected = false

  constructor(private sweetAlertService: SweetAlertService, private orderEndpoint: OrderEndpoint) {}

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
    'cancelReason',
    'backupAt',
    'historyUser',
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
    { value: 'cancelReason', name: 'Refund reason' },
    { value: 'backupAt', name: 'Historical backup date' },
    { value: 'historyUser', name: 'User' },
  ]

  ngOnInit(): void {}

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
