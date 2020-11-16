import { AppConfigStore } from './../../../../../core/services/app-config.store'
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { OrderConsumerExcelMapping } from '../../../services/mappings/order-consumer-excel-mapping'
import { UploadExcelComponent } from '../../../../../shared/common-components/upload-excel/upload-excel.component'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { OrderConsumerExcelExportMapping } from '../../../services/mappings/order-consumer-excel-export.mapping'

@Component({
  selector: 'app-order-consumer-import',
  templateUrl: './order-consumer-import.component.html',
  styleUrls: ['./order-consumer-import.component.css'],
})
export class OrderConsumerImportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild('uploadExcel') child: UploadExcelComponent
  @ViewChild('excelExporter') excelExport
  normalData: []
  abnormalData: []
  excelMapping: any
  errorMessage = []
  data: any
  filteredValue: null
  exportExcelData = {}
  excelExportMapping: OrderConsumerExcelExportMapping
  tableColumnsAllSelected = false

  tableColumnDisplaySelection = new FormControl([
    'OrderNo',
    'BillingDate',
    'EnterDate',
    'customer',
    'product',
    'payment',
    'warehouse',
    'Comment3',
    'action',
    'error',
  ])

  availableColumns = [
    { value: 'OrderNo', name: 'Order Number' },
    { value: 'Reference', name: 'Order Reference' },
    { value: 'sender', name: 'Sender' },
    { value: 'recipient', name: 'Recipient' },
    { value: 'EnterDate', name: 'Entry Date' },
    { value: 'BillingDate', name: 'Financial date' },
    { value: 'customer', name: 'Client' },
    { value: 'product', name: 'Product' },
    { value: 'payment', name: 'Payment Info' },
    { value: 'warehouse', name: 'Warehouse Info' },
    { value: 'Cin7InterCode', name: 'Cin7 Inter Code' },
    { value: 'Comment1', name: 'Comment1' },
    { value: 'Comment2', name: 'Comment2' },
    { value: 'Comment3', name: 'Financial Comment' },
    { value: 'action', name: 'Action' },
    { value: 'error', name: 'Error' },
  ]

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private orderEndpoint: OrderEndpoint,
    private sweetAlertService: SweetAlertService,
    private _appConfigStore: AppConfigStore
  ) {}

  passFilteredValue($event) {
    this.filteredValue = $event
  }

  toggleAllColumnSelection(allSelectValue) {
    if (!allSelectValue) {
      this.tableColumnDisplaySelection.patchValue([...this.availableColumns.map((item) => item['value'])])
    } else {
      this.tableColumnDisplaySelection.patchValue([])
    }
  }

  ngOnInit() {
    this.columnSettingsControl()
    this.excelMapping = new OrderConsumerExcelMapping(this._appConfigStore)
    this.excelExportMapping = new OrderConsumerExcelExportMapping(this._appConfigStore)
  }

  columnSettingsControl() {
    let x = JSON.parse(localStorage.getItem('orderImportTableColumns'))

    if (x && x.length) {
      this.tableColumnDisplaySelection.setValue(x)
    }

    this.tableColumnDisplaySelection.valueChanges.subscribe((res) => {
      setTimeout(() => {
        if (this.tableColumnDisplaySelection.value.length)
          localStorage.setItem('orderImportTableColumns', JSON.stringify(this.tableColumnDisplaySelection.value))
      }, 5000)
    })
  }

  // Output for excel child component
  excelOutput(event) {
    this.initObjects()
    this.errorMessage = []
    let data = this.excelMapping.mapData(event)
    this.normalData = data['newNormalDataTable']
    this.abnormalData = data['newAbnormalDataTable']
    console.log(data)
    if (data['dropedRowCounter']) {
      this.excelMapErrorHandler('There are ' + data['dropedRowCounter'] + ' invalid messages')
    }
    if (this.abnormalData.length != 0) {
      this.excelMapErrorHandler('There are ' + this.abnormalData.length + ' abnormal orders')
      // this.prepTableData(this.abnormalData, "abnormal")
    } else {
      // this.prepTableData(this.normalData, "normal")
    }
  }

  excelMapErrorHandler(message) {
    this.errorMessage.push(message)
  }

  async save() {
    //no record can not save
    if (!this.normalData) {
      this.sweetAlertService.showSweetAlert('No records!')
      return
    }
    //need user's confirmation!
    const res = await this.sweetAlertService.saveAlert()
    console.log(res)
    if (!res.value) return

    console.log(this.normalData)

    this.orderEndpoint._ordersConsumerImport(this.normalData).subscribe((res) => {
      console.log(res)
      this.sweetAlertService.showSuccessMessage('Save Successfully!')
      this.initObjects()
    })
  }

  initObjects() {
    this.normalData = []
    this.abnormalData = []
    // this.datasource = new MatTableDataSource()
    this.errorMessage = []
    this.child.reset()
  }

  exportToExcelAbnormal() {
    console.log(this.abnormalData)
    this.exportExcelData = this.excelExportMapping.mapping(this.abnormalData)
    setTimeout(() => {
      this.excelExport.exportAsXLSX(this.exportExcelData)
    }, 400)
  }

  exportToExcel() {
    console.log(this.normalData)
    let dataExport = this.excelExportMapping.mapping(this.normalData)

    this.exportExcelData = dataExport

    setTimeout(() => {
      this.excelExport.exportAsXLSX(this.exportExcelData)
    }, 400)
  }
}
