import { FormControl } from '@angular/forms'

export class Order {
  public OrderId: string
  public ProjectName: string // 面单类型 ProjectId
  public OrderNo: string //订单编号
  public ProductCode: string //品名简称
  public CustomerString: string //客户
  //public ImportBatchId: string; //导入批次?
  public Warehouse: string //仓库
  public RuleId: number
  public RuleName: string
  public StockCustomerId: number
  public StockCustomerCode: string

  public orderFormControl = new FormControl()
}

/*
  
   //订单类型
  // 面单类型  ProjectId
  //订单编号   OrderNo
  //品名简称   ProductString
  //客户       CustomerString
  //导入批次    ImportBatchId
   //仓库 
  */

/*
single: display: customerstring
group: display: StockCustomerCode------use StockCustomerId
all from status = 4, StockRetailOrder is only used for the rules

Order and stockretailorder    match ruleid and rulename
add check to check if there is no ruleid and rulename for order in Order

groupOrder still the same

rule just for the rules.

1110142756  成人
1110142757  婴儿











  */
