import { Component, EventEmitter, Inject, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../services/endpoints/finance.endpoint'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { FinanceOrderDialogComponent } from '../../finance/orders/finance-order-dialog/finance-order-dialog.component'

@Component({
  selector: 'app-inventory-inquiry-order-detail',
  templateUrl: './inventory-inquiry-order-detail.component.html',
  styleUrls: ['./inventory-inquiry-order-detail.component.css'],
})
export class InventoryInquiryOrderDetailComponent implements OnInit {
  public tableData: any
  filteredValue = ''
  ordersTableData: any
  tableColumnsAllSelected = false
  isExport = false
  postCin7Data = []
  batchNum = 3
  filteredOrders: any
  outputData = new EventEmitter()
  comment1Array = []
  comment2Array = []
  comment3Array = []
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
    { value: 'warehouse', name: 'Warehouse Info' },
    { value: 'Status', name: 'Order Status' },
    { value: 'Cin7InterCode', name: 'Cin7 Inter Code' },
    { value: 'Comment1', name: 'Comment' },
    { value: 'Comment2', name: 'Comment2' },
    { value: 'Comment3', name: 'Financial Comment' },
    { value: 'TrackingNo', name: 'Tracking No' },
    { value: 'TrackingComments', name: 'Tracking Comments' },
  ]
  excelExportValue = []
  filteredexcelExportValue = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public salesOrderNo: any,
    private orderService: OrderEndpoint,
    private sweetAlert: SweetAlertService,
    private financeEndpoint: FinanceEndpoint,
    public dialogRef: MatDialogRef<InventoryInquiryOrderDetailComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.salesOrderNo)
    this.comment1Array = []
    this.comment2Array = []
    this.comment3Array = []
    this.isExport = !!this.salesOrderNo.isExport
    this.filteredOrders = this.isExport ? this.salesOrderNo.orderNos : []
    if (!this.salesOrderNo.type) {
      this.orderService._orderSearchByOrderArray(this.salesOrderNo.isExport ? this.salesOrderNo.orderNos : this.salesOrderNo).subscribe((value) => {
        this.setTableData(value)
      })
    } else {
      this.setTableData(this.salesOrderNo.data)
    }
  }

  bulkProductUpdate() {
    const dataToPut = []

    this.salesOrderNo.data.map((row) => {
      dataToPut.push({
        OrderNo: row.OrderNo,
        StockCustomerId: row.StockCustomerId,
        ProductId: row.ProductId,
        OrderPrice: row.OrderPrice,
        TotalPrice: row.TotalPrice,
        BillingCustomerId: row.BillingCustomerId,
        Reference: row.Reference,
        FirstName: row.FirstName,
      })
    })

    this.orderService._BatchUpdateRetailOrderByOrderNos(dataToPut).subscribe((_) => {
      this.sweetAlert.successAlert('Update successfully!')
      this.dialogRef.close()
    })
  }

  setTableData(value) {
    this.tableData = value
    this.tableData.map((row: any) => {
      if (row.Comment1 && !this.comment1Array.includes(row.Comment1)) {
        this.comment1Array.push(row.Comment1)
      }
      if (row.Comment2 && !this.comment2Array.includes(row.Comment2)) {
        this.comment2Array.push(row.Comment2)
      }
      if (row.Comment3 && !this.comment3Array.includes(row.Comment3)) {
        this.comment3Array.push(row.Comment3)
      }
      const excelRow = {}
      excelRow['订单号'] = row.OrderNo
      excelRow['寄件人'] = row.Sender
      excelRow['寄件人电话'] = row.SenderPhone
      excelRow['寄件人地址'] = row.SenderAddr
      excelRow['收件人'] = row.Recipient
      excelRow['收件人电话'] = row.RecipientPhone
      excelRow['收件人地址'] = row.RecipientAddr
      excelRow['收件证照号'] = row.RecipientIDNo
      excelRow['品名备注'] = row.ProductString
      excelRow['录入日期'] = row.EnterDate
      excelRow['财务日期'] = row.BillingDate
      excelRow['客户名称'] = row.CustomerString
      excelRow['纽币金额'] = row.Nzd
      excelRow['库存客户'] = row.StockCustomerCode
      excelRow['特殊情况'] = row.Comment2
      excelRow['备注'] = row.Comment1
      excelRow['Project Name'] = row.ProjectName
      this.excelExportValue.push(excelRow)
    })
    this.filteredexcelExportValue = this.excelExportValue
    console.log(this.comment1Array)
    console.log(this.comment2Array)
    console.log(this.comment3Array)
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

  getFilteredOrders(orders) {
    this.filteredOrders = orders
    this.filteredexcelExportValue = this.excelExportValue.filter((e) => orders.findIndex((o) => o.OrderNo == e['订单号']) != -1)
  }

  async addToBatch(number) {
    this.postCin7Data = []
    this.filteredOrders.map((row) => {
      this.postCin7Data.push({
        orderNo: row.OrderNo,
        extraCin7Batch: number,
      })
    })
    console.log(this.postCin7Data)
    const saveAlert = await this.sweetAlert.saveAlert('Sure to add?')
    if (!saveAlert.value) {
      return
    }
    this.financeEndpoint._financialUpdateExtraCin7Batch(this.postCin7Data).subscribe((_) => {
      this.outputData.emit(true)
      this.sweetAlert.successAlert('Added successfully!')
      this.postCin7Data.map((item: any) => {
        for (const row of this.tableData) {
          if (row.OrderNo === item.orderNo) {
            row.Reference = row.Reference.replace(/-\d$/, '-' + item.extraCin7Batch)
            break
          }
        }
      })
    })
  }
}
