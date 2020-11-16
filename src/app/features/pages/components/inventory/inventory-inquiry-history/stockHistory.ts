import { History } from './history'

export class StockHistory {
  public StockId: string
  public WarehouseId: number
  public WarehouseName: string
  public ProductId: number
  public ProductName: string
  public CustomerId: number
  public CustomerName: string
  public Quantity: number // 实际库存
  public PreSellQty: number // 正在销售
  public PreBuyQty: number // 正在购买
  public PreTranInQty: number // 正在转入
  public PreTranOutQty: number // 正在转出
  public availableQuantity: number // 可用库存
  public histories: History[] = []

  public getAvailableQuantity(): number {
    return this.Quantity - this.PreSellQty - this.PreTranOutQty
  }
}
