export class History {
  public StockId: string
  public TransactionType: number
  public TransactionQty: number
  public Quantity: number // 实际库存
  public PreSellQty: number // 正在销售
  public PreBuyQty?: number // 正在购买
  public PreTranInQty?: number // 正在转入
  public PreTranOutQty?: number // 正在转出
  public availableQuantity?: number // 可用库存
  public CreatedAt: string
  public RetailOrderId: string
  public OrderNo: string
  public WholeOrderId: string

  public getAvailableQuantity(): number {
    return this.Quantity - this.PreSellQty - this.PreTranOutQty
  }
}
