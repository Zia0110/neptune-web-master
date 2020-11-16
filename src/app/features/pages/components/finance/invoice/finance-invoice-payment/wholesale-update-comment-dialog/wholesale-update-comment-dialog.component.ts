import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-wholesale-update-comment-dialog',
  templateUrl: './wholesale-update-comment-dialog.component.html',
  styleUrls: ['./wholesale-update-comment-dialog.component.css'],
})
export class WholesaleUpdateCommentDialogComponent implements OnInit {
  comment: any
  @Output() outputData = new EventEmitter()

  constructor(
    private financeEndpoint: FinanceEndpoint,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<WholesaleUpdateCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.comment = this.data.Comment
  }

  onSubmit() {
    const dataToPut = [
      {
        OrderId: this.data.OrderId,
        Comment: this.comment,
      },
    ]
    this.financeEndpoint._updateWholeSaleModificationComment(dataToPut).subscribe((_) => {
      this.sweetAlertService.successAlert('Update successfully!')
      this.outputData.emit(true)
      this.onNoClick()
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
