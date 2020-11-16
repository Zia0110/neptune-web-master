import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-special-customer-dialog',
  templateUrl: './special-customer-dialog.component.html',
  styleUrls: ['./special-customer-dialog.component.css'],
})
export class SpecialCustomerDialogComponent implements OnInit {
  tableData: any
  isShowTable = false

  constructor(private financeService: FinanceEndpoint, public dialog: MatDialog, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.financeService
      ._getSpecialPrice()
      .toPromise()
      .then((res) => {
        this.tableData = res
        this.isShowTable = true
      })
  }
}
