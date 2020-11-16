import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-supplier-item-dialog',
  templateUrl: './supplier-item-dialog.component.html',
  styleUrls: ['./supplier-item-dialog.component.css'],
})
export class SupplierItemDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  nameFormControl = new FormControl('')
  checked: boolean

  constructor(
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<SupplierItemDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.nameFormControl.setValue(this.data.SupplierName)
      this.checked = !!this.data.Display
    }
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.nameFormControl.value) {
        this.sweetAlertService.showSweetAlert('Please fill in name before submitting！')
        return
      }
      this.outputData.emit({
        name: this.nameFormControl.value,
        isDisplay: this.checked ? 1 : 0,
      })
      this.dialogRef.close()
    }
  }
}
