import { FormControl } from '@angular/forms'

export class GroupOrder {
  public GroupOrderId: number
  public StockCustomerId: number
  public StockCustomerCode: string
  public CustomerString: string //客户
  public ProjectName: string // 面单类型
  public ProductCode: string //品名简称
  public Warehouse: string //仓库
  public OrdersIdArray: any[] = []
  public groupOrderFormControl = new FormControl()

  public getNumberOfGroupOrder(): number {
    return this.OrdersIdArray.length
  }
}

/*
1222945474
1223245678
*/
