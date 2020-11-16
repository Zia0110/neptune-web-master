import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-customer-group-name-dialog',
  templateUrl: './customer-group-name-dialog.component.html',
  styleUrls: ['./customer-group-name-dialog.component.css'],
})
export class CustomerGroupNameDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  nameFormControl = new FormControl('')

  constructor(private sweetAlertService: SweetAlertService, public dialogRef: MatDialogRef<CustomerGroupNameDialogComponent>) {}

  ngOnInit(): void {}

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.nameFormControl.value) {
        this.sweetAlertService.showSweetAlert('Please fill in name before submitting！')
        return
      }
      this.outputData.emit(this.nameFormControl.value)
      this.dialogRef.close()
    }
  }
}
