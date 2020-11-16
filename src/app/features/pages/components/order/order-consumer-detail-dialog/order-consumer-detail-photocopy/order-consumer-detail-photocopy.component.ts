import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'
import { DomSanitizer } from '@angular/platform-browser'
import { MatDialog } from '@angular/material/dialog'
import { ImgPresentComponent } from '../../../../../../shared/common-components/img-present/img-present.component'
ImgPresentComponent
@Component({
  selector: 'app-order-consumer-detail-photocopy',
  templateUrl: './order-consumer-detail-photocopy.component.html',
  styleUrls: ['./order-consumer-detail-photocopy.component.css'],
})
export class OrderConsumerDetailPhotocopyComponent implements OnInit, OnChanges {
  @Input() orderNo
  @Input() editMode
  @Input() imageType

  images = []
  image: {
    url: string
    orderId: string
    imageType: number
  }
  imgSrc
  imgSelected = false
  orderID

  public message: string
  selectedFile: File = null
  constructor(private orderService: OrderEndpoint, public _img: DomSanitizer, public changeDetector: ChangeDetectorRef, public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.getOrderImageByOrderNo(this.orderNo)
  }

  getOrderImageByOrderNo(orderNo) {
    const x = []
    this.orderService._orderSearchByOrderNo(orderNo).subscribe((res) => {
      if (res[0] != null) {
        this.orderID = res[0].OrderId
        // this.images = res[0].Images;
        for (let i of res[0].Images) {
          if (i.ImageType == this.imageType) {
            x.push(i)
          }
        }
        this.images = x
      }
    })
  }

  onFileChange(event) {
    this.selectedFile = <File>event.target.files[0]
    if (event.target.files.length != 0) {
      this.imgSelected = true
      this.imgSrc = window.URL.createObjectURL(this.selectedFile)
    } else {
      this.imgSelected = false
    }
  }

  async onUpload() {
    const uploadData = new FormData()
    uploadData.append('imageFile', this.selectedFile, this.selectedFile.name)
    console.log(uploadData)
    await this.orderService
      ._imageUpload(uploadData)
      .toPromise()
      .then((res: any) => {
        this.image = { url: `${res.FileNameForStorage}`, orderId: this.orderID, imageType: this.imageType }

        this.orderService._orderImageUpload(this.image).subscribe((res) => {
          this.getOrderImageByOrderNo(this.orderNo)
        })
      })
  }

  imageDelete(id) {
    this.orderService._orderImageDelete(id).subscribe((res) => {
      this.getOrderImageByOrderNo(this.orderNo)
    })
  }

  openImg(data) {
    this.dialog
      .open(ImgPresentComponent, {
        width: 'auto',
        data: data,
      })
      .afterClosed()
      .subscribe((res) => this.getOrderImageByOrderNo(this.orderNo))
  }
}
