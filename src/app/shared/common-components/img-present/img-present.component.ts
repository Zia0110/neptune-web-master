import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { OrderEndpoint } from '../../../features/pages/services/endpoints/order.endpoint'

@Component({
  selector: 'app-img-present',
  templateUrl: './img-present.component.html',
  styleUrls: ['./img-present.component.css'],
})
export class ImgPresentComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ImgPresentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private ordEP: OrderEndpoint) {}

  ngOnInit(): void {
    console.log(this.data)
  }

  deleteImg() {
    this.ordEP._orderImageDelete(this.data.ImageId).subscribe((res) => console.log(res))
  }
}
