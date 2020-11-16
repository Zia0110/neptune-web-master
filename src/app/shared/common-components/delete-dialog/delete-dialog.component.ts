import { Component, NgModule, OnInit, ViewChild, Inject } from '@angular/core'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent implements OnInit {
  objectKeys = Object.keys

  formChanges = null
  clientId = null
  regConfig: any
  mappingDatas: any

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    console.log(this.data)
  }

  confirmDelete() {
    this.dialogRef.close(true)
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
