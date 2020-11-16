/*
 *   @Created Date: 01/04/2020
 *   @Modified Data: 23/04/2020
 *   @Author: Kenneth
 *   @Place: Auckland
 *
 *   - 控件使用说明：
 *     - 关于@Input id：
 *       - ProductId是一个必要的attr
 *     - 关于@Input customerId：可以查询不同客户的库存
 *     - 关于@Input isBaseProduct：是否为基础产品卡片（默认为销售产品卡片）
 *     - 关于@Input name：
 *       - 需要传入一个name string
 *
 *   - 例子
 *     - in the html:
 *       <app-card-product
 *         [id]='ProductId'
 *         [name]="SomeNameString"
 *       ></app-card-product>
 * */
import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.css'],
})
export class CardProductComponent implements OnInit {
  @Input() id: number
  @Input() customerId = 446
  @Input() isBaseProduct = false
  @Input() name = 'Product Name'
  content: any
  isRequest = false
  isRequestBase = false

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  showCard(): void {
    if (!this.isBaseProduct) {
      if (!this.isRequest) {
        this.isRequest = true
        if (this.id) {
          this.http
            .get(environment.baseUrl + '/api/Product/GetProductCardById?productId=' + this.id + '&customerId=' + this.customerId)
            .toPromise()
            .then((value: any) => {
              this.content = value
            })
        }
      }
    } else {
      if (!this.isRequestBase) {
        this.isRequestBase = true
        if (this.id) {
          this.http
            .get(environment.baseUrl + '/api/BaseProduct/GetBaseProductCardById?baseProductId=' + this.id + '&customerId=' + this.customerId)
            .toPromise()
            .then((value: any) => {
              this.content = value
            })
        }
      }
    }
  }
}
