import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-stock-customer-mapping-dialog',
  templateUrl: './stock-customer-mapping-dialog.component.html',
  styleUrls: ['./stock-customer-mapping-dialog.component.css'],
})
export class StockCustomerMappingDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  customerFormControl = new FormControl('')
  customerPlaceHolder: string
  stockCustomerInfo: string

  constructor(
    public dialogRef: MatDialogRef<StockCustomerMappingDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.customerFormControl.setValue(this.data ? this.data.CustomerId : '')
    this.customerPlaceHolder = this.data ? this.data.CustomerCode + ' -- ' + this.data.CustomerName : ''
    this.stockCustomerInfo = this.data ? this.data.StockCustomerInfo : ''
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      const saveAlert = await this.sweetAlertService.saveAlert('Confirm to save？')
      if (!saveAlert.value) {
        return
      }
      if (!this.customerFormControl.value || !this.stockCustomerInfo) {
        this.sweetAlertService.showSweetAlert('Please complete the form before saving！')
        return
      }
      const requestData = {
        customerId: this.customerFormControl.value,
        stockCustomerInfo: this.stockCustomerInfo,
      }
      this.outputData.emit(requestData)
      this.dialogRef.close()
    }
  }
}
