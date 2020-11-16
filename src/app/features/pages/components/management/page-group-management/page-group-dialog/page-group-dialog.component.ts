import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-page-group-dialog',
  templateUrl: './page-group-dialog.component.html',
  styleUrls: ['./page-group-dialog.component.css'],
})
export class PageGroupDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  ordering: number
  icon: string
  groupName: string

  constructor(
    public dialogRef: MatDialogRef<PageGroupDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.ordering = this.data ? this.data.Ordering : null
    this.groupName = this.data ? this.data.GroupName : ''
    this.icon = this.data ? this.data.Icon : ''
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      const saveAlert = await this.sweetAlertService.saveAlert('Confirm to save？')
      if (!saveAlert.value) {
        return
      }
      if (this.ordering <= 0) {
        this.sweetAlertService.showSweetAlert('Ordering should be positive integer!')
        return
      }
      if (!this.ordering || !this.icon || !this.groupName) {
        this.sweetAlertService.showSweetAlert('Please complete the form before saving！')
        return
      }
      const requestData = {
        GroupName: this.groupName,
        Icon: this.icon,
        Ordering: this.ordering,
      }
      this.outputData.emit(requestData)
      this.dialogRef.close()
    }
  }
}
