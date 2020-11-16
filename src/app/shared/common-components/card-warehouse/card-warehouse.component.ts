/*
 *   @Created Date: 01/04/2020
 *   @Modified Data: 23/04/2020
 *   @Author: Kenneth
 *   @Place: Auckland
 *
 *   - 控件使用说明：
 *     - 关于@Input id：
 *       - WarehouseId是一个必要的attr
 *     - 关于@Input name：
 *       - 需要传入一个name string
 *
 *   - 例子
 *     - in the html:
 *       <app-card-warehouse
 *         [id]='WarehouseId'
 *         [name]="SomeNameString"
 *       ></app-card-warehouse>
 * */
import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-card-warehouse',
  templateUrl: './card-warehouse.component.html',
  styleUrls: ['./card-warehouse.component.css'],
})
export class CardWarehouseComponent implements OnInit {
  @Input() id: number
  @Input() name = 'Warehouse Name'
  content: any
  isRequest = false

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  showCard(): void {
    if (!this.isRequest) {
      this.isRequest = true
      this.http
        .get(environment.baseUrl + '/api/Warehouse/GetWarehouseStockByWarehouseId/' + this.id)
        .toPromise()
        .then((value: any) => {
          this.content = value
        })
    }
  }
}
