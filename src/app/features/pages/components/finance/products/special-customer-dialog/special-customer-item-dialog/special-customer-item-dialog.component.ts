import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-special-customer-item-dialog',
  templateUrl: './special-customer-item-dialog.component.html',
  styleUrls: ['./special-customer-item-dialog.component.css'],
})
export class SpecialCustomerItemDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  prjectName: string
  selectedBeginDate: string
  selectedEndDate: string
  customerFormControl = new FormControl('')
  productFormControl = new FormControl('')
  price: number

  constructor(
    public dialogRef: MatDialogRef<SpecialCustomerItemDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    private financeEndpoint: FinanceEndpoint
  ) {}

  ngOnInit(): void {
    this.prjectName = this.data ? 'Edit' : 'Add'
    this.customerFormControl.setValue(this.data ? this.data.customerId : '')
    this.productFormControl.setValue(this.data ? this.data.productId : '')
    this.price = this.data ? this.data.price : null
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      const saveAlert = await this.sweetAlertService.saveAlert('Are you sure to save？')
      if (!saveAlert.value) {
        return
      }
      if (!this.customerFormControl.value) {
        this.sweetAlertService.showSweetAlert('Please select a customer before saving！')
        return
      }
      if (!this.productFormControl.value) {
        this.sweetAlertService.showSweetAlert('Please select a product before saving！')
        return
      }
      if (!this.price) {
        this.sweetAlertService.showSweetAlert('Please select a price before saving！')
        return
      }
      if (!this.selectedBeginDate || !this.selectedEndDate) {
        this.sweetAlertService.showSweetAlert('Please select a date range before saving！')
        return
      }
      const requestData = {
        productId: this.productFormControl.value,
        customerId: this.customerFormControl.value,
        effectiveDate: this.selectedBeginDate,
        expiryDate: this.selectedEndDate,
        price: this.price,
      }
      if (this.data) {
        this.financeEndpoint._updateSpecialPrice(this.data.priceId, requestData).subscribe((_) => {
          this.sweetAlertService.successAlert('Saved successfully！')
          this.dialogRef.close()
          this.outputData.emit(true)
        })
      } else {
        this.financeEndpoint._addSpecialPrice(requestData).subscribe((_) => {
          this.sweetAlertService.successAlert('Saved successfully！')
          this.dialogRef.close()
          this.outputData.emit(true)
        })
      }
    }
  }

  dateRangePickerOutput($event) {
    this.selectedBeginDate = $event.begin.slice(0, 10)
    this.selectedEndDate = $event.end.slice(0, 10)
  }
}
