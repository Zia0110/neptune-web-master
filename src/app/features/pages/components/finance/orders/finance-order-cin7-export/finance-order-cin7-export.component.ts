import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatTabGroup } from '@angular/material/tabs'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { CommentDialogComponent } from '../../../../../../shared/common-components/comment-dialog/comment-dialog.component'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'
import { Cin7ExcelExportMapping } from '../../../../services/mappings/cin7-excel-export.mapping'
import { Cin7ExcelMapping } from '../../../../services/mappings/cin7-excel-mapping'
import { InventoryInquiryOrderDetailComponent } from '../../../inventory/inventory-inquiry-order-detail/inventory-inquiry-order-detail.component'

@Component({
  selector: 'app-finance-order-cin7-export',
  templateUrl: './finance-order-cin7-export.component.html',
  styleUrls: ['./finance-order-cin7-export.component.css'],
  providers: [],
})
export class FinanceOrderCin7ExportComponent implements OnInit {
  selected = new FormControl(0)
  batchDatas = []
  excelExportValue1 = null
  excelExportValue2 = null
  excelExportValue3 = null
  excelExportValue4 = null
  excelExportValue5 = null
  excelMapping: any
  clientSelected = new FormControl(0)
  excelExportMapping: Cin7ExcelExportMapping
  excelExportFileName: string
  dataToDialog: any
  dataForComments: any
  isSetBatches = false

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup
  @ViewChild('cin7Table') cin7Table
  @ViewChild('excelExporter1') excelExporter1
  @ViewChild('excelExporter2') excelExporter2
  @ViewChild('excelExporter3') excelExporter3
  @ViewChild('excelExporter4') excelExporter4
  @ViewChild('excelExporter5') excelExporter5

  constructor(
    private financeEndpoint: FinanceEndpoint,
    private cdr: ChangeDetectorRef,
    private sweetAlert: SweetAlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getOrdersCurrentDataApi()
    this.excelMapping = new Cin7ExcelMapping()
    this.excelExportMapping = new Cin7ExcelExportMapping()

    this.clientSelected.valueChanges.subscribe((res) => {
      setTimeout(() => {
        if (res && typeof res == 'number') this.getOrdersClientDataApi(res)
      }, 1500)
    })
  }

  tabNavigate() {
    if (!this.tabs || !(this.tabs instanceof MatTabGroup)) return

    const tabCount = this.tabs._tabs.length

    this.tabs['_indexToSelect'] = tabCount
    this.cdr.detectChanges()

    console.log(this.tabs)
  }

  // Get Current Orders
  getOrdersCurrentDataApi() {
    this.financeEndpoint._getOrdersForCin7Export().subscribe((res: any) => {
      this.dataToDialog = res.OrderNos
      this.dataForComments = res.RetailOrderGroupBys
      console.log(res), (res['current'] = true), this.batchDatas.push(res), this.tabNavigate()
    })
  }

  // Get Client Orders
  getOrdersClientDataApi(clientId) {
    this.financeEndpoint._getOrdersForCin7ByClientId(clientId).subscribe((res) => {
      console.log(res)
      if (!res['length']) {
        return this.sweetAlert.showSweetAlert('No info!')
      }
      this.sortOrdersReturnByClient(res, clientId)
    })
  }

  // Get Batch Orders
  getOrdersByBatchIdApi(batchID) {
    this.financeEndpoint._getOrdersForCin7ByBatchId(batchID).subscribe((res) => {
      console.log(res), this.sortOrdersReturnByBatchId(res)
    })
  }

  sortOrdersReturnByClient(datas, clientId) {
    const x = {
      RetailOrderGroupBys: [],
      ClientId: clientId,
      current: false,
    }
    for (const data of datas) {
      const mappedDetail = {
        Ref: data.OrderRef,
        Company: data.CompanyName,
        Cin7InterCode: data.Cin7Code,
        ProjectName: '电子单',
        ItemQty: data.ItemQty,
        Notes: data.Notes,
        ItemPrice: data.ItemPrice,
      }
      x['RetailOrderGroupBys'].push(mappedDetail)
    }
    this.batchDatas.push(x)
  }

  sortOrdersReturnByBatchId(datas) {
    for (const data of datas) {
      console.warn(data)
      if (!data.Details.length) {
        break
      }
      data['RetailOrderGroupBys'] = []
      for (const detail of data.Details) {
        const mappedDetail = {
          Ref: detail.OrderRef,
          Company: detail.CompanyName,
          Cin7InterCode: detail.Cin7Code,
          ProjectName: '电子单',
          ItemQty: detail.ItemQty,
          Notes: detail.Notes,
          ItemPrice: detail.ItemPrice,
        }
        data['RetailOrderGroupBys'].push(mappedDetail)
        delete data.Details
      }
      data['current'] = false
      this.batchDatas.push(data)
    }
    this.tabNavigate()
  }

  removeTab(index: number) {
    this.batchDatas.splice(index, 1)
  }

  completeExport() {
    for (const data of this.batchDatas) {
      if (data.current) {
        if (data.RetailOrderGroupBys && data.RetailOrderGroupBys.length > 0) {
          this.addCommentDialog(data)
          return
        } else {
          this.sweetAlert.showSweetAlert('Nothing needs to export!')
        }
      }
    }
    this.sweetAlert.showSweetAlert('Nothing needs to export!')
  }

  updateCin7ExportApi(data) {
    this.financeEndpoint._updateOrdersOnCin7Export(data).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('Update successfully!'), this.getOrdersCurrentDataApi()
    })
  }

  openSetBatchesDialog() {
    const dialogRef = this.dialog.open(InventoryInquiryOrderDetailComponent, {
      width: '100%',
      height: '90%',
      data: {
        orderNos: this.dataToDialog,
        isExport: true,
      },
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.isSetBatches = true
      }
    })
    dialogRef.afterClosed().subscribe((_) => {
      if (this.isSetBatches) {
        this.ngOnInit()
        this.isSetBatches = false
      }
    })
  }

  exportToExcel() {
    // let x = this.batchDatas[this.selected.value]
    console.log(this.cin7Table)
    const data = this.cin7Table.tableData
    const data1 = data.filter((row) => row.Ref.includes('-1'))
    const data2 = data.filter((row) => row.Ref.includes('-2'))
    const data3 = data.filter((row) => row.Ref.includes('-3'))
    const data4 = data.filter((row) => row.Ref.includes('-4'))
    const data5 = data.filter((row) => row.Ref.includes('-5'))
    if (data1.length) {
      this.excelExportValue1 = this.excelExportMapping.mapping(data1)
      console.log(this.excelExportValue1)
      setTimeout(() => {
        this.excelExporter1.exportAsXLSX()
      }, 400)
    }
    if (data2.length) {
      this.excelExportValue2 = this.excelExportMapping.mapping(data2)
      console.log(this.excelExportValue2)
      setTimeout(() => {
        this.excelExporter2.exportAsXLSX()
      }, 400)
    }
    if (data3.length) {
      this.excelExportValue3 = this.excelExportMapping.mapping(data3)
      console.log(this.excelExportValue3)
      setTimeout(() => {
        this.excelExporter3.exportAsXLSX()
      }, 400)
    }
    if (data4.length) {
      this.excelExportValue4 = this.excelExportMapping.mapping(data4)
      console.log(this.excelExportValue4)
      setTimeout(() => {
        this.excelExporter4.exportAsXLSX()
      }, 400)
    }
    if (data5.length) {
      this.excelExportValue5 = this.excelExportMapping.mapping(data5)
      console.log(this.excelExportValue5)
      setTimeout(() => {
        this.excelExporter5.exportAsXLSX()
      }, 400)
    }
  }

  addCommentDialog(passData) {
    this.dialog
      .open(CommentDialogComponent, {
        width: '35%',
        data: { label: '导出备注' },
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res)
        passData['comment'] = res
        this.updateCin7ExportApi(passData)
      })
  }

  dateRangePickerOutput($event) {
    console.log($event)
    this.getBatchIdByDatesApi($event.begin, $event.end)
  }

  getBatchIdByDatesApi(beginDate, endDate) {
    this.financeEndpoint._getBatchIdForCin7ByDates(beginDate, endDate).subscribe((res) => {
      console.log(res)
      if (!res['length']) {
        this.sweetAlert.showSweetAlert('No Info!')
      }
      for (const set in res) {
        if (res[set].OutCin7BatchId) {
          this.getOrdersByBatchIdApi(res[set].OutCin7BatchId)
        }
      }
    })
  }
}
