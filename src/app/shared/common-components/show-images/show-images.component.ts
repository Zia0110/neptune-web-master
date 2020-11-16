import { Component, OnInit, Inject, Input } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { environment } from '../../../../environments/environment'
import Swal from 'sweetalert2'
import { ZoomSingleImageComponent } from './zoom-single-image/zoom-single-image.component'

/*
input:  urlsArray is a string array with urls, and deleteAllowed: true with button false without button
const dialogRef = this.dialog.open(ShowImagesComponent, {
    width: '1200px',
    height: '80%',
    data: {
      urlsArray : urls,
      deleteAllowed: true,
    }
})

output: after deleting the images, the left over array;
*/

@Component({
  selector: 'app-show-images',
  templateUrl: './show-images.component.html',
  styleUrls: ['./show-images.component.css'],
})
export class ShowImagesComponent implements OnInit {
  public imageBaseUrl = environment.imageBaseUrl
  @Input() inputData
  returnedData = []
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, private dialogRef: MatDialogRef<ShowImagesComponent>) {
    dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.data = this.inputData ? this.inputData : this.data
    this.returnedData = []
    this.data.urlsArray.map((item) => {
      this.returnedData.push(item.FileNameForStorage)
    })
    console.log(this.data)
    // console.log(this.data.deleteAllowed)
  }

  public deleteImage(url): void {
    // console.log(url)
    Swal.fire({
      text: 'Sure to delete this picture？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.value) {
        this.updateImageUrlsArray(url)
      }
    })
  }

  public updateImageUrlsArray(url: string): void {
    let theIndex: number = this.data.urlsArray.indexOf(url)
    this.data.urlsArray.splice(theIndex, 1)
    this.returnedData = []
    this.data.urlsArray.map((item) => {
      this.returnedData.push(item.FileNameForStorage)
    })
  }

  public zoomImage(url): void {
    this.dialog.open(ZoomSingleImageComponent, {
      width: '1500px',
      height: '800px',
      data: url,
    })
  }
}
