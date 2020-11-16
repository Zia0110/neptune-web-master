export class WholeSaleOrder {
  public CustomerId: number
  public CustomerCode: string //客户代码
  public CustomerName: string //客户名称
  public CreatedAt: string //创建日期
  public PaidAt: string //付款日期
  public Comment: string // 备注信息

  public WholeSaleProductDeitals: any[] = []
  /*
    "ProductName" : "",   //产品名称
    "WarehouseName" : "",   //仓库
    "Quantity" : 0   //数量
    */
}
