import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-finance-order-dialog',
  templateUrl: './finance-order-dialog.component.html',
  styleUrls: ['./finance-order-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FinanceOrderDialogComponent implements OnInit {
  orderData: any
  @ViewChild('orderChange') orderChangeForm
  viewRendered = false
  constructor(
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private financeEndpoint: FinanceEndpoint,
    public dialogRef: MatDialogRef<FinanceOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    console.log(this.data)
    this.orderData = this.data
  }

  saveChanges() {
    if (!this.orderChangeForm.form.dirty) {
      return this.sweetAlert.showSweetAlert('Nothing changed')
    }
    if (!this.orderChangeForm.form.valid && !this.orderChangeForm.isNonDalProduct) {
      return this.sweetAlert.showSweetAlert('There is a problem with content')
    }
    let oldData = this.data
    // Edited data from child editor
    let editedData = this.orderChangeForm.saveData()
    // Merge into new data
    let newData = { ...oldData, ...editedData }

    this.updateOrderApi(newData)
  }

  updateOrderApi(transformData) {
    console.log(transformData)

    this.financeEndpoint._updateOrderConsumerFinance(transformData).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('Successful change！')
      this.closeDialog()
    })
  }

  ngAfterViewInit() {
    console.log('view rendered')
    setTimeout(() => {
      this.viewRendered = true
    }, 300)
  }
  closeDialog() {
    this.dialogRef.close()
  }
}
