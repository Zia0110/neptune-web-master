import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import * as moment from 'moment'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
// import { InventoryClientPurchaseCreateDialogComponent } from '../inventory-client-purchase-create-dialog/inventory-client-purchase-create-dialog.component';
import { TransportEndpoint } from '../../../services/endpoints/transport.endpoint'
import { LogisticInvoiceExcelExportMapping } from '../../../services/mappings/logistic-invoice-excel-export.mapping'

@Component({
  selector: 'app-transport-logistics-invoice-list',
  templateUrl: './transport-logistics-invoice-list.component.html',
  styleUrls: ['./transport-logistics-invoice-list.component.css'],
})
export class TransportLogisticsInvoiceListComponent implements OnInit {
  datas: any
  beginDate = ''
  endDate = ''
  allChecked = false
  customerFormControl = new FormControl()
  excelExportValue: any
  excelExportMapping: any

  @ViewChild('table') invoiceTable

  constructor(private transportEndpoint: TransportEndpoint, public dialog: MatDialog, private sweetAlert: SweetAlertService) {}

  ngOnInit() {
    this.excelExportMapping = new LogisticInvoiceExcelExportMapping()
    this.getUnReadLogisticsInvoiceDataApi()
    this.customerFormControl.valueChanges.subscribe((res) => {
      if (res && this.beginDate && this.endDate) {
        this.getLogisticsInvoiceDataByFilterApi()
      }
    })
  }

  checkAll() {
    this.invoiceTable.markAllCheck(this.allChecked)
  }

  excelOutput(event) {
    const putData = []
    if (event && event.length) {
      event.map((row) => {
        if (row['Invoice Id'] && row['Invoice No']) {
          putData.push({
            InvoiceId: row['Invoice Id'],
            InvoiceNo: row['Invoice No'],
          })
        }
      })
      this.transportEndpoint._updateInvoiceNo(putData).subscribe((_) => {
        this.sweetAlert.successAlert('Update successfully!')
        this.ngOnInit()
      })
    }
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  dateRangePickerOutput($event) {
    this.beginDate = this.getUTCdate($event.begin)
    this.endDate = this.getUTCdate($event.end)
    this.getLogisticsInvoiceDataByFilterApi()
  }

  getUnReadLogisticsInvoiceDataApi() {
    this.transportEndpoint._getTransportLogisticsUnReadDataApi().subscribe((res) => {
      console.log(res)
      this.datas = res
      this.excelExportValue = this.excelExportMapping.mapping(this.datas)
    })
  }

  getLogisticsInvoiceDataByFilterApi() {
    let qp
    if (this.customerFormControl.value) {
      qp = 'customerId=' + this.customerFormControl.value + '&beginDate=' + this.beginDate + '&endDate=' + this.endDate
    } else {
      qp = 'beginDate=' + this.beginDate + '&endDate=' + this.endDate
    }
    this.transportEndpoint._getTransportLogisticsDataByFilter(qp).subscribe((res: any) => {
      console.log(res)
      if (!res.length) {
        this.sweetAlert.successAlert('No data for this period！')
      }
      this.datas = res
      this.excelExportValue = this.excelExportMapping.mapping(this.datas)
    })
  }

  saveChanges() {
    const confrimedArray = []
    for (const data of this.invoiceTable.tableData) {
      if (data.IsConfirmed == true) {
        data.IsConfirmed = 1
        confrimedArray.push(data.InvoiceId)
      }
    }
    console.log(confrimedArray)
    this.updateInvoiceAsReadApi(confrimedArray)
  }

  updateInvoiceAsReadApi(data) {
    this.transportEndpoint._updateTransportLogisticsDataAsRead(data).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('Successfully updated！')
    })
  }
}
