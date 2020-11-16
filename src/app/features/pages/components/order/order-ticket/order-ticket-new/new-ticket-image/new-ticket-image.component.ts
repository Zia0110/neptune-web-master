import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { environment } from '../../../../../../../../environments/environment'
import { OrderEndpoint } from '../../../../../services/endpoints/order.endpoint'
import { ImgPresentComponent } from '../../../../../../../shared/common-components/img-present/img-present.component'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-new-ticket-image',
  templateUrl: './new-ticket-image.component.html',
  styleUrls: ['./new-ticket-image.component.css'],
})
export class NewTicketImageComponent implements OnInit {
  @Input() useType
  public imageBaseUrl = environment.imageBaseUrl
  public uploadedImagesForDisplaying: string[] = []
  public myFiles: File[] = []
  public imgSelected: boolean = true
  public returnUrls: any[] = []

  constructor(private orderService: OrderEndpoint, public _img: DomSanitizer, public dialog: MatDialog, private sweetAlert: SweetAlertService) {}

  ngOnInit() {}

  public getFileDetails(event) {
    //console.log (e.target.files);
    this.myFiles.length = 0
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i])
    }
  }

  async uploadFiles() {
    if (this.myFiles.length == 0) {
      this.sweetAlert.showSweetAlert('Please upload image！')
    } else {
      for (var i = 0; i < this.myFiles.length; i++) {
        const uploadData = new FormData()
        uploadData.append('imageFile', this.myFiles[i], this.myFiles[i].name)
        await this.orderService
          ._imageUpload(uploadData)
          .toPromise()
          .then((res: any) => {
            console.log(res)
            this.uploadedImagesForDisplaying.push(this.imageBaseUrl + res.ImageUrl)
            this.returnUrls.push(res)
            this.sweetAlert.showSuccessMessage('uploaded successfully!')
          })
      }
    }

    // await this.orderService._imageUpload(uploadData)
    //                         .toPromise()
    //                         .then((res) => {
    //                           // this.image = {
    //                           //   // Url: `${res}`,
    //                           //   Url: this.imageBaseUrl + res,
    //                           // }
    //                           // this.images.push(this.image)
    //                           this.returnUrls.push(res) // tested in https://storage.googleapis.com/neptune_media, and this is correct.
    //                           console.log(res)
    //                           // this.confirmUpload = false
    //                           this.orderService.returnImagesUrls.next(this.returnUrls)
    //                         })
  }
}

// export class NewTicketImageComponent implements OnInit {
//   public imageBaseUrl = environment.imageBaseUrl
//   public selectedFile: File = null
//   public imgSelected: boolean = false
//   public imgSrc: any
//   public image: {
//     Url: string
//   }
//   public images: any[] = []
//   public returnUrls: any[] = []
//   public confirmUpload: boolean = false
//   // @Output() returnUrlsEmit: EventEmitter<any> = new EventEmitter();
//   @Input() useType = 1

//   constructor(private orderService: OrderEndpoint, public _img: DomSanitizer, public dialog: MatDialog) {}

//   ngOnInit(): void {}

//   ngOnChanges(): void {
//     // this.returnUrlsEmit.emit(this.returnUrls);
//   }

//   public onFileChange(event) {
//     this.confirmUpload = true
//     this.selectedFile = <File>event.target.files[0]
//     if (event.target.files.length != 0) {
//       this.imgSelected = true
//       this.imgSrc = window.URL.createObjectURL(this.selectedFile)
//     } else {
//       this.imgSelected = false
//     }
//   }

//   async onUpload() {
//     const uploadData = new FormData()
//     uploadData.append('imageFile', this.selectedFile, this.selectedFile.name)
//     console.log(uploadData)
//     await this.orderService
//       ._imageUpload(uploadData)
//       .toPromise()
//       .then((res) => {
//         this.image = {
//           // Url: `${res}`,
//           Url: this.imageBaseUrl + res,
//         }
//         this.images.push(this.image)
//         this.returnUrls.push(res) // tested in https://storage.googleapis.com/neptune_media, and this is correct.
//         console.log(res)
//         this.confirmUpload = false
//         this.orderService.returnImagesUrls.next(this.returnUrls)
//       })
//   }

//   test(): void {
//     console.log(this.returnUrls)
//   }
// }
