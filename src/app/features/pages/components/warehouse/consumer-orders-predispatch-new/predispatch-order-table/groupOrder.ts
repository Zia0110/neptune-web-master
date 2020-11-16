import { FormControl } from '@angular/forms'

export class GroupOrder {
  public GroupOrderId: number
  public StockCustomerId: number
  public StockCustomerCode: string
  public CustomerString: string //客户
  public ProjectName: string // 面单类型
  public ProductId: number
  public ProductCode: string //品名简称
  public Warehouse: string //仓库
  public OrdersIdArray: any[] = []
  public groupOrderFormControl = new FormControl()
  public RuleId: number
  public RuleName: string

  public commentFromControl = new FormControl()
  public comment: string //库管备注1

  public commentFromControl2 = new FormControl()
  public comment2: string //库管备注1

  public enableConfirmButton: boolean = true

  public getNumberOfGroupOrder(): number {
    return this.OrdersIdArray.length
  }
}
