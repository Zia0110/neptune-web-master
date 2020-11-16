import { Component, OnChanges, Input, ViewChild, Output, EventEmitter, Inject, OnInit } from '@angular/core'
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup } from '@angular/forms'
import { OrderEndpoint } from '../../../pages/services/endpoints/order.endpoint'
import { SweetAlertService } from '../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../pages/services/endpoints/finance.endpoint'

@Component({
  selector: 'app-finance-order-table-edit-dialog',
  templateUrl: './finance-order-table-edit-dialog.component.html',
  styleUrls: ['./finance-order-table-edit-dialog.component.css'],
})
export class FinanceOrderTableEditDialogComponent implements OnInit {
  // form: FormGroup
  // stockCustomerSelection = null
  isClicked = false
  @ViewChild('orderChange') orderChangeForm
  constructor(
    // private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FinanceOrderTableEditDialogComponent>,
    // private orderEndpoint: OrderEndpoint,
    private sweetAlert: SweetAlertService,
    private financeEndpoint: FinanceEndpoint,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    console.log(this.data)
    // this.orderEditFormInit(this.data)
  }

  save() {
    if (!this.orderChangeForm.form.dirty) {
      return this.sweetAlert.showSweetAlert('没有更改 任何内容')
    }
    this.isClicked = true

    this.data = this.orderChangeForm.saveData()

    this.updateOrderApi(this.data)
  }

  updateOrderApi(transformData) {
    console.log(transformData)

    this.financeEndpoint._updateOrderConsumerFinance(transformData).subscribe(
      (res) => {
        console.log(res), this.sweetAlert.showSuccessMessage('Successful change！')
        this.dialogRef.close()
      },
      (err) => {
        this.isClicked = false
      }
    )
  }
}
