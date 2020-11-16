import { Component, OnInit } from '@angular/core'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'
import { FormControl } from '@angular/forms'
import { LogisticInvoiceExcelExportMapping } from '../../../../services/mappings/logistic-invoice-excel-export.mapping'
import { WholesaleModificationExcelExportMapping } from '../../../../services/mappings/wholesale-modification-excel-export.mapping'

@Component({
  selector: 'app-finance-invoice-update',
  templateUrl: './finance-invoice-update.component.html',
  styleUrls: ['./finance-invoice-update.component.css'],
})
export class FinanceInvoiceUpdateComponent implements OnInit {
  isShowTable = true
  tableData = []
  selectedBeginDate: string
  selectedEndDate: string
  showNonCompleteFC = new FormControl(true)
  originTableData = []
  excelExportValue: any
  excelExportMapping: any

  constructor(private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit(): void {
    this.excelExportMapping = new WholesaleModificationExcelExportMapping()
    this.showNonCompleteFC.valueChanges.subscribe((res) => {
      this.onChangeTableData(res)
    })
  }

  onChangeTableData(res) {
    if (!res) {
      this.tableData = this.originTableData
    } else if (res && this.originTableData) {
      this.tableData = this.originTableData.filter((row) => {
        let isConfirmed = true
        row.Configures.map((item) => {
          if (item.ConfirmedQty !== item.Quantity) {
            isConfirmed = false
          }
        })
        return !isConfirmed
      })
    }
    this.excelExportValue = this.excelExportMapping.mapping(this.tableData)
  }

  getRequest() {
    if (this.selectedBeginDate && this.selectedEndDate) {
      this.financeEndpoint
        ._GetInfiniteUpdateWholeSaleOrder(this.selectedBeginDate, this.selectedEndDate)
        .toPromise()
        .then((res: any) => {
          if (!res.length) {
            this.sweetAlertService.successAlert('No data for this period！')
          } else {
            this.sweetAlertService.successAlert('Data extracted successfully！')
          }
          this.tableData = res
          this.originTableData = res
          this.onChangeTableData(this.showNonCompleteFC.value)
        })
    } else {
      this.financeEndpoint
        ._GetInfiniteUpdateWholeSaleOrder()
        .toPromise()
        .then((res: any) => {
          if (!res.length) {
            this.sweetAlertService.successAlert('No data for this period！')
          } else {
            this.sweetAlertService.successAlert('Data extracted successfully！')
          }
          this.tableData = res
          this.originTableData = res
          this.onChangeTableData(this.showNonCompleteFC.value)
        })
    }
  }

  dateRangePickerOutput($event) {
    this.selectedBeginDate = $event.begin
    this.selectedEndDate = $event.end
  }

  tableEmit($event) {
    if ($event) {
      this.getRequest()
    }
  }

  excelOutput(event) {
    const putData = []
    if (event && event.length) {
      event.map((row) => {
        if (row['Order Id'] && row['Comment']) {
          putData.push({
            OrderId: row['Order Id'],
            Comment: row['Comment'],
          })
        }
      })
      this.financeEndpoint._updateWholeSaleModificationComment(putData).subscribe((_) => {
        this.sweetAlertService.successAlert('Update successfully!')
        this.getRequest()
      })
    }
  }

  async deleteRow(data) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.financeEndpoint.deleteWholesaleOrder(data).subscribe((_) => {
      this.sweetAlertService.successAlert('Delete Successfully!')
      this.getRequest()
    })
  }
}
