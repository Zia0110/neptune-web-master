import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-name-management-dialog',
  templateUrl: './name-management-dialog.component.html',
  styleUrls: ['./name-management-dialog.component.css'],
})
export class NameManagementDialogComponent implements OnInit {
  @Output() outputDataMapping = new EventEmitter()
  orderProjectNameSelected: any
  mappingFormControl = new FormControl('')
  nameFormControl = new FormControl('')

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<NameManagementDialogComponent>
  ) {}

  ngOnInit(): void {}

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (this.data === '新建客户') {
        if (!this.mappingFormControl.value || !this.nameFormControl.value) {
          this.sweetAlertService.showSweetAlert('Please select the customer and fill in the mapping name before submitting!')
          return
        }
        this.outputDataMapping.emit({
          customerId: this.nameFormControl.value,
          nameString: this.mappingFormControl.value,
        })
        this.dialogRef.close()
      } else if (this.data === '新建产品') {
        if (!this.mappingFormControl.value || !this.nameFormControl.value) {
          this.sweetAlertService.showSweetAlert('Please select the product and fill in the mapping name before submitting!')
          return
        }
        this.outputDataMapping.emit({
          productId: this.nameFormControl.value,
          nameString: this.mappingFormControl.value,
        })
        this.dialogRef.close()
      } else {
        if (!this.mappingFormControl.value) {
          this.sweetAlertService.showSweetAlert('Please fill in the mapping name before submitting!')
          return
        }
        this.outputDataMapping.emit(this.mappingFormControl.value)
        this.dialogRef.close()
      }
    }
  }
}
