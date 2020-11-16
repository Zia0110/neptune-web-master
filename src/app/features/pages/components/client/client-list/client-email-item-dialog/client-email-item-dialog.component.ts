import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-client-email-item-dialog',
  templateUrl: './client-email-item-dialog.component.html',
  styleUrls: ['./client-email-item-dialog.component.css'],
})
export class ClientEmailItemDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  emailFormControl = new FormControl('')

  constructor(private sweetAlertService: SweetAlertService, public dialogRef: MatDialogRef<ClientEmailItemDialogComponent>) {}

  ngOnInit(): void {
    this.emailFormControl.setValidators(Validators.email)
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.emailFormControl.value || !this.emailFormControl.valid) {
        this.sweetAlertService.showSweetAlert('Please fill in correct email before submitting！')
        return
      }
      this.outputData.emit(this.emailFormControl.value)
      this.dialogRef.close()
    }
  }
}
