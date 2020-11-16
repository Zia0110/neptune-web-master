import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-change-customer-dialog',
  templateUrl: './change-customer-dialog.component.html',
  styleUrls: ['./change-customer-dialog.component.css'],
})
export class ChangeCustomerDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  billingCustomerFormControl = new FormControl('')
  stockCustomerFormControl = new FormControl('')

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<ChangeCustomerDialogComponent>
  ) {}

  ngOnInit(): void {
    this.billingCustomerFormControl.setValue(this.data.billingCustomer.id)
    this.stockCustomerFormControl.setValue(this.data.stockCustomer.id)
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.billingCustomerFormControl.value || !this.stockCustomerFormControl.value) {
        this.sweetAlertService.showSweetAlert('Please complete form before submitting！')
        return
      }
      this.outputData.emit({
        billingCustomerId: this.billingCustomerFormControl.value,
        stockCustomerId: this.stockCustomerFormControl.value,
      })
      this.dialogRef.close()
    }
  }
}
