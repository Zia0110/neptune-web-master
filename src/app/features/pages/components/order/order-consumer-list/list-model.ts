export class TableDataModel {
  order: {
    OrderNo: string
    Reference: string
    ProjectIdNo: number // 1 for 电子单，2 for 纸单
    ProjectId: string // 1 for 电子单，2 for 纸单
    Concat: string
  }
  sender: {
    Sender: string
    SenderAddr: string
    SenderPhone: string
    Concat: string
  }
  recipient: {
    Recipient: string
    RecipientAddr: string
    RecipientPhone: string
    RecipientIdno: string
    Concat: string
  }
  product: {
    ProductId?: number
    ProductString: string
    ProductCode: string
    Uom: number
    Concat: string
  }
  dates: {
    EnterDate: string
    BillingDate: string
    Concat: string
  }
  customer: {
    CustomerId?: number
    CustomerString: string
    LastName: string
    FirstName: string
    Reference?: string
    Concat: string
  }
  Cin7InterCode: string
  payment: {
    Nzd: number
    UnitPrice: string | any
    TotalPrice: number
    OrderPrice: number
  }
}
