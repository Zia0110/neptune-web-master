import { History } from './history'

export class TableHistory {
  public Date: string
  public Quantity: number
  public Sales: number
  public Purchase: number
  public SalesOrderNo: string[] = [] //零售
  public WholeOrderIdNo: string[] = [] //购买
}
