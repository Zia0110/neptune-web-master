import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-finance-credit-import',
  templateUrl: './finance-credit-import.component.html',
  styleUrls: ['./finance-credit-import.component.css'],
})
export class FinanceCreditImportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'customerName', 'credit', 'balance']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  isShowNotice = true

  constructor(private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit(): void {}

  excelOutput(event) {
    if (event.length) {
      this.isShowNotice = false
      this.ELEMENT_DATA = []
      this.sweetAlertService.successAlert('Uploaded successfully！')
      event.map((row) => {
        const entry = Object.entries(row)
        this.ELEMENT_DATA.push({
          customerName: entry[0][1],
          credit: entry[1][1],
          balance: entry[2][1],
        })
      })
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator
    } else {
      this.sweetAlertService.showSweetAlert('Uploaded file is empty, please upload again！')
      this.ELEMENT_DATA = []
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator
    }
  }

  onSubmit() {
    this.financeEndpoint._postCreditImport(this.ELEMENT_DATA).subscribe((_) => {
      this.sweetAlertService.successAlert('Saved successfully！')
      this.ELEMENT_DATA = []
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator
      this.isShowNotice = true
    })
  }
}
