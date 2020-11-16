import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-price-selection-dialog',
  templateUrl: './price-selection-dialog.component.html',
  styleUrls: ['./price-selection-dialog.component.css'],
})
export class PriceSelectionDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  @Output() outputDataDate = new EventEmitter()
  orderProjectNameSelected: any
  dateFormControl = new FormControl('')

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<PriceSelectionDialogComponent>
  ) {}

  ngOnInit(): void {}

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.data.isSaveForm) {
        if (!this.orderProjectNameSelected) {
          this.sweetAlertService.showSweetAlert('Please select a time period before submitting！')
          return
        }
        switch (this.orderProjectNameSelected) {
          case '0':
            this.outputData.emit('current')
            this.dialogRef.close()
            break
          default:
            this.outputData.emit(this.data[this.orderProjectNameSelected - 1])
            this.dialogRef.close()
            break
        }
      } else {
        if (!this.dateFormControl.value) {
          this.sweetAlertService.showSweetAlert('Please select the effective time before submitting！')
          return
        }
        // console.log(this.dateFormControl.value)
        this.outputDataDate.emit(this.dateFormControl.value)
        this.dialogRef.close()
      }
    }
  }
}
