import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-batch-cancel-dialog',
  templateUrl: './batch-cancel-dialog.component.html',
  styleUrls: ['./batch-cancel-dialog.component.css'],
})
export class BatchCancelDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  nameFormControl = new FormControl('')

  constructor(private sweetAlertService: SweetAlertService, public dialogRef: MatDialogRef<BatchCancelDialogComponent>) {}

  ngOnInit(): void {}

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.nameFormControl.value) {
        this.sweetAlertService.showSweetAlert('Please fill in cancel reason before submitting！')
        return
      }
      this.outputData.emit(this.nameFormControl.value)
      this.dialogRef.close()
    }
  }
}
