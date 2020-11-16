import { Component, OnInit, Input, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { OrderEndpoint } from '../../../features/pages/services/endpoints/order.endpoint'
import { WholeSaleOrder } from './wholeSaleOrder'
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-wholesale-order',
  templateUrl: './wholesale-order.component.html',
  styleUrls: ['./wholesale-order.component.css'],
})
export class WholesaleOrderComponent implements OnInit {
  @Input() wholeSaleOrder: string[] = []
  public wholeSaleOrderFromBackEnd: any
  public wholeSaleOrderArray: WholeSaleOrder[] = []
  public displayedColumns: string[] = ['客户代码', '客户名称', '创建日期', '付款日期', '备注信息', '产品名称', '仓库', '数量']
  public dataSource: any

  // public displayedColumnsProducts: string[] = ['产品名称', '仓库', '数量'];
  // public dataSourceProducts: any;

  constructor(@Inject(MAT_DIALOG_DATA) public orderNoArray: any, private orderEndpoint: OrderEndpoint) {}

  ngOnInit(): void {
    if (this.wholeSaleOrder.length == 0) {
      this.wholeSaleOrder = this.orderNoArray
    }
    this.orderEndpoint._inventoryInquiryWholeSaleOrderDetail().subscribe((value) => {
      this.wholeSaleOrderFromBackEnd = value
      this.convertToWholeSaleOrderArray()
      this.buildTable()
    })
  }

  private convertToWholeSaleOrderArray(): void {
    for (let wholeSaleOrderId of this.wholeSaleOrder) {
      for (let wholeSaleOrder of this.wholeSaleOrderFromBackEnd) {
        if (wholeSaleOrderId == wholeSaleOrder['OrderId']) {
          let a_wholeSaleOrder = new WholeSaleOrder()
          a_wholeSaleOrder.CustomerId = wholeSaleOrder['CustomerId']
          a_wholeSaleOrder.CustomerCode = wholeSaleOrder['CustomerCode']
          a_wholeSaleOrder.CustomerName = wholeSaleOrder['CustomerName']
          a_wholeSaleOrder.CreatedAt = this.convertToTableHistoryDate(wholeSaleOrder['CreatedAt'])
          a_wholeSaleOrder.PaidAt = this.convertToTableHistoryDate(wholeSaleOrder['PaidAt'])
          a_wholeSaleOrder.Comment = wholeSaleOrder['Comment']
          for (let wholeSaleProductDetail of wholeSaleOrder['WholeSaleProductDeitals']) {
            let a_obj: any = {
              ProductName: wholeSaleProductDetail['ProductName'], //产品名称
              ProductId: wholeSaleProductDetail['ProductId'],
              WarehouseName: wholeSaleProductDetail['WarehouseName'], //仓库
              WarehouseId: wholeSaleProductDetail['WarehouseId'],
              Quantity: wholeSaleProductDetail['Quantity'], //数量
            }
            a_wholeSaleOrder.WholeSaleProductDeitals.push(a_obj)
          }
          this.wholeSaleOrderArray.push(a_wholeSaleOrder)
        }
      }
    }
  }

  private buildTable(): void {
    this.dataSource = new MatTableDataSource<WholeSaleOrder>(this.wholeSaleOrderArray)
    //this.dataSourceProducts = new MatTableDataSource<any>(this.wholeSaleOrderArray);
  }

  private convertToTableHistoryDate(date: string): string {
    //date example: 2020-04-18T12:47:20.377
    let resDate: string
    // resDate = date.replace('T', ' ')
    let i = date.indexOf('T')
    resDate = date.slice(0, i)
    return resDate
  }

  test(): void {
    console.log(this.wholeSaleOrder)
    console.log(this.wholeSaleOrderFromBackEnd)
    console.log(this.wholeSaleOrderArray)
  }
}

/*


WholeOrderId： 21341f92-25e3-43f0-84c1-ed4aab72359c
http://45.76.123.59:5050/api/Stock/GetStockHistoriesByStockId/d1b2145c-771d-4319-b503-00de27d51906
To match:
OrderId:
http://45.76.123.59:5050/api/StockWholeSaleOrder/GetPaidWholeSaleOrderDetail

CustomerCode + CustomerName + CreatedAt + PaidAt
------
Loop: WholeSaleProductDeitals
ProductName + Quantity + WarehouseName 

*/
