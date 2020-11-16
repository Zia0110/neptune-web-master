import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-bulk-comments-modify-dialog',
  templateUrl: './bulk-comments-modify-dialog.component.html',
  styleUrls: ['./bulk-comments-modify-dialog.component.css'],
})
export class BulkCommentsModifyDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  comment1 = ''
  comment2 = ''

  constructor(private sweetAlertService: SweetAlertService, public dialogRef: MatDialogRef<BulkCommentsModifyDialogComponent>) {}

  ngOnInit(): void {}

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.comment1 && !this.comment2) {
        this.sweetAlertService.showSweetAlert('Please input comment firstly！')
        return
      }
      const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to submit and save data！')
      if (!saveAlert.value) {
        return
      }
      console.log(this.comment1)
      console.log(this.comment2)
      this.outputData.emit({
        comment1: this.comment1,
        comment2: this.comment2,
      })
      this.dialogRef.close()
    }
  }
}
