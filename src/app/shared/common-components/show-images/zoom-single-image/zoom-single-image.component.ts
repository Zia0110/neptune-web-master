import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-zoom-single-image',
  templateUrl: './zoom-single-image.component.html',
  styleUrls: ['./zoom-single-image.component.css'],
})
export class ZoomSingleImageComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public url: any) {}

  ngOnInit(): void {
    console.log(this.url)
  }
}
