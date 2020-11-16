import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: [],
})
export class CommentDialogComponent implements OnInit {
  comment: ''
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CommentDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log(this.data)
  }

  submit() {
    this.dialogRef.close(this.comment)
  }
}
