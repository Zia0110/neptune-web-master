/*
 *   @Created Date: 01/04/2020
 *   @Modified Data: 23/04/2020
 *   @Author: Kenneth
 *   @Place: Auckland
 *
 *   - 控件使用说明：
 *     - 关于@Input id：
 *       - CustomerId是一个必要的attr
 *     - 关于@Input name：
 *       - 需要传入一个name string
 *
 *   - 例子
 *     - in the html:
 *       <app-card-customer
 *         [id]='CustomerId'
 *         [name]="SomeNameString"
 *       ></app-card-customer>
 * */
import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-card-customer',
  templateUrl: './card-customer.component.html',
  styleUrls: ['./card-customer.component.css'],
})
export class CardCustomerComponent implements OnInit {
  @Input() id: number
  @Input() name = 'Customer Name'
  content: any
  isRequest = false

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  showCard(): void {
    if (!this.isRequest) {
      this.isRequest = true
      this.http
        .get(environment.baseUrl + '/api/Customer/' + this.id)
        .toPromise()
        .then((value: any) => {
          this.content = value
        })
    }
  }
}
