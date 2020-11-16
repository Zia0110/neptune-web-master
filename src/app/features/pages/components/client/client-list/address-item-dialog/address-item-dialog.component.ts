import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-address-item-dialog',
  templateUrl: './address-item-dialog.component.html',
  styleUrls: ['./address-item-dialog.component.css'],
})
export class AddressItemDialogComponent implements OnInit {
  address: any
  suburb: any
  city: any
  state: any
  @Output() outputData = new EventEmitter()

  constructor(
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<AddressItemDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.address = this.data.address
      this.suburb = this.data.suburb
      this.city = this.data.city
      this.state = this.data.state
    }
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.address || !this.suburb || !this.city || !this.state) {
        this.sweetAlertService.showSweetAlert('Please fill in and resubmit！')
        return
      }
      this.outputData.emit({
        address: this.address,
        suburb: this.suburb,
        city: this.city,
        state: this.state,
      })
      this.dialogRef.close()
    }
  }
}
