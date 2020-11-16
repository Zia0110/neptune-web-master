import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { Order } from './order'
import { MatPaginator } from '@angular/material/paginator'
import { Warehouse } from './warehouse'
import { GroupOrder } from './groupOrder'
import Swal from 'sweetalert2'
import { StockRetailOrder } from './stockRetailOrder'
import { Rule } from './rule'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { findStringInObj } from './../../../../../core/utils/utils'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'

//placeholder="选择仓库"

@Component({
  selector: 'app-consumer-orders-predispatch',
  templateUrl: './consumer-orders-predispatch.component.html',
  styleUrls: ['./consumer-orders-predispatch.component.css'],
})
export class ConsumerOrdersPredispatchComponent implements OnInit {
  // public onLineOrder: boolean = true;
  // public offLineOrder: boolean = true;
  // public searchedCustomer: string;
  // public searchedProduct: string;
  // public preDispatchOrdersFromBackEnd: any
  // public stockRetailOrdersFromBackEnd: any
  // public ordersArray: Order[]
  // public dataSource
  // public groupDataSource
  // public displayedColumns: string[] = ['面单类型', '订单编号', '品名简称', '客户', '分仓规则']
  // public displayedGroupColumns: string[] = ['仓储客户', '面单类型', '品名简称', '订单数量', '分仓规则']

  // public displayedColumns: string[] = ['面单类型', '订单编号', '品名简称', '客户', '分仓规则', '确认修改'];
  // public displayedGroupColumns: string[] = ['仓储客户', '面单类型', '品名简称', '订单数量','分仓规则', '确认批量修改'];
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  //   @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>()

  //   public orderNoArrayFromText: string[]
  //   public singleWarehouseChangeControl = new FormControl()
  //   public muliWarehouseChangeControl = new FormControl()
  //   public warehousesFromBackEnd: any
  //   public warehouseArray: Warehouse[] = []
  //   public warehouseNamesForOptions: string[] = []

  //   public rulesFromBackEnd: any
  //   public rulesArray: Rule[] = []
  //   public rulesForOptions: string[] = []

  //   public groupOrdersArray: GroupOrder[] = [] // this is for the 批量修改
  //   public groupOrdersArrayForDisplaying: GroupOrder[] = []
  //   public stockRetailOrdersArray: StockRetailOrder[] = []
  //   public testPlaceHolder: boolean = true
  //   public showAutoAssignRules: boolean = false
  //   public showGroupAutoAssignRules: boolean = false

  //   public testString: string = 'testString'
  //   public saveAutoAssignDisabled: boolean = true
  //   constructor(
  //     private formBuilder: FormBuilder,
  //     public dialog: MatDialog,
  //     // public mockDataAPIService:MockData,
  //     // private http: HttpClient,
  //     private warehouseEndpoint: WarehouseEndpoint,
  //     private sweetAlertService: SweetAlertService
  //   ) {}

  ngOnInit() {
    //     this.warehouseEndpoint.getPreDispatchOrders().subscribe((value) => {
    //       this.preDispatchOrdersFromBackEnd = value
    //       this.ordersArray = this.convertJsonObjsToOrders(this.preDispatchOrdersFromBackEnd)
    //       this.groupOrdersArray = this.filterOrdersToGroupOrders(this.ordersArray)
    //       this.groupOrdersArrayForDisplaying = this.checkOrdersNumberInGroupOrder(this.groupOrdersArray)
    //       this.groupDataSource = new MatTableDataSource<GroupOrder>(this.groupOrdersArrayForDisplaying)
    //       this.setUpGroupPaginator()
    //       this.setUpDataSource()
    //       this.setUpPaginator()
    //     })
    //     this.warehouseEndpoint.getWarehouseRules().subscribe((value) => {
    //       this.rulesFromBackEnd = value
    //       this.rulesArray = this.convertJsonObjsToRules(this.rulesFromBackEnd)
    //     })
    //     this.warehouseEndpoint.getStockRetailOrder().subscribe((value) => {
    //       this.stockRetailOrdersFromBackEnd = value
    //       this.stockRetailOrdersArray = this.convertJsonObjsToStockRetailOrders(this.stockRetailOrdersFromBackEnd)
    //     })
  }

  //   private setUpDataSource(): void {
  //     this.dataSource = new MatTableDataSource<Order>(this.ordersArray)
  //     this.dataSource.filterPredicate = this.createFilter()
  //   }

  //   private setUpPaginator(): void {
  //     this.dataSource.paginator = this.paginator.toArray()[0]
  //   }

  //   private setUpGroupPaginator(): void {
  //     this.groupDataSource.paginator = this.paginator.toArray()[1]
  //   }
  //   public autoAssignRuleToOrders(): void {
  //     this.saveAutoAssignDisabled = false
  //     this.assignRulesToOrders(this.ordersArray, this.stockRetailOrdersArray)

  //     //To assign new orders(with rules) to grouporders
  //     // no need to do this again
  //     //this.groupOrdersArray = this.filterOrdersToGroupOrders(this.ordersArray);
  //     this.setRuleNameToGroupOrders()
  //     this.groupOrdersArrayForDisplaying = this.checkOrdersNumberInGroupOrder(this.groupOrdersArray)
  //     this.groupDataSource = new MatTableDataSource<GroupOrder>(this.groupOrdersArrayForDisplaying)
  //     this.setUpGroupPaginator()
  //   }

  //   private setRuleNameToGroupOrders(): void {
  //     for (let groupOrder of this.groupOrdersArray) {
  //       let theRuleName = groupOrder.OrdersIdArray[0].RuleName
  //       groupOrder.groupOrderFormControl.setValue(theRuleName)
  //     }
  //   }

  //   public saveAutoAssignRules($event) {
  //     Swal.fire({
  //       text: '确定保存并提交所有订单？',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: '确定',
  //     }).then((result) => {
  //       if (result.value) {
  //         let orderIds: string[] = []
  //         let ruleIds: number[] = []
  //         for (let order of this.ordersArray) {
  //           //this.warehouseEndpoint.updateRuleToPreDispatchOrder(order.OrderNo, pickedRuleId);
  //           orderIds.push(order.OrderId)
  //           ruleIds.push(order.RuleId)
  //         }

  //         /*
  //                 saveAutoAssignRules is commented because if we really run the code below, we are
  //                 going to lose all the data which has status = 4
  //                 */

  //         // this.warehouseEndpoint.updateRuleIdToStockOrders(orderIds, ruleIds).subscribe((res) => {
  //         //   this.sweetAlertService.successAlert()
  //         // })

  //         this.refreshOrders(orderIds)
  //       }
  //     })
  //   }

  //   //this is to assign rule id and name to ordersarray
  //   // so we can display the rules
  //   private assignRulesToOrders(ordersArray: Order[], stockRetailOrdersArray: StockRetailOrder[]): void {
  //     for (let order of ordersArray) {
  //       let targetStockRetailOrder: StockRetailOrder[] = []
  //       targetStockRetailOrder = stockRetailOrdersArray.filter((stockRetailOrder) => stockRetailOrder.OrderId === order.OrderId)
  //       order.RuleId = targetStockRetailOrder[0].RuleId
  //       order.RuleName = targetStockRetailOrder[0].RuleName
  //       order.orderFormControl.setValue(targetStockRetailOrder[0].RuleName)
  //     }
  //     this.dataSource = new MatTableDataSource<Order>(this.ordersArray)
  //     this.setUpPaginator()
  //     // console.log(this.ordersArray);
  //     // for (let order of this.ordersArray){
  //     //     console.log(order.OrderNo, order.RuleId, order.RuleName);
  //     // }
  //   }

  //   //only displays groupOrder which order number > 1
  //   public checkOrdersNumberInGroupOrder(groupOrders: GroupOrder[]): GroupOrder[] {
  //     let res: GroupOrder[] = []
  //     for (let groupOrder of groupOrders) {
  //       if (groupOrder.getNumberOfGroupOrder() > 0) {
  //         res.push(groupOrder)
  //       }
  //     }
  //     //console.log(res);
  //     return res
  //   }

  //   private convertJsonObjsToOrders(jsonObjs: any[]): Order[] {
  //     const res: Order[] = []
  //     for (const order of jsonObjs) {
  //       const a_order = new Order()
  //       a_order.OrderId = order['OrderId']
  //       a_order.ProjectName = order['ProjectName'] // 面单类型
  //       a_order.OrderNo = order['OrderNo'] //订单编号
  //       a_order.ProductCode = order['ProductCode'] //拼命简称
  //       a_order.CustomerString = order['CustomerString'] //客户
  //       a_order.StockCustomerId = order['StockCustomerId']
  //       a_order.StockCustomerCode = order['StockCustomerCode']
  //       res.push(a_order)
  //     }
  //     return res
  //   }

  //   private filterOrdersToGroupOrders(orders: Order[]): GroupOrder[] {
  //     let res: GroupOrder[] = []
  //     //console.log(orders);
  //     for (let order of orders) {
  //       if (res.length == 0) {
  //         let new_groupOrder = new GroupOrder()
  //         new_groupOrder.StockCustomerId = order.StockCustomerId
  //         new_groupOrder.StockCustomerCode = order.StockCustomerCode
  //         new_groupOrder.ProjectName = order.ProjectName
  //         new_groupOrder.ProductCode = order.ProductCode
  //         new_groupOrder.OrdersIdArray.push(order)
  //         res.push(new_groupOrder)
  //       } else {
  //         /*
  //                     if no same order (means no break), we need to create a new
  //                     groupOrder.
  //                     but if we found one, we have to break and set the createNewGroupOrder
  //                     to false to invoid creating a new groupOrder.
  //                     at last, make the createNewGroupOrder to true.
  //                 */
  //         let createNewGroupOrder: boolean = true
  //         for (let groupOrder of res) {
  //           if (this.checkSameOrder(groupOrder, order)) {
  //             createNewGroupOrder = false
  //             groupOrder.OrdersIdArray.push(order)
  //             break //if found the same one then no need to loop the rest
  //           }
  //         }
  //         if (createNewGroupOrder) {
  //           let new_groupOrder = new GroupOrder()
  //           new_groupOrder.StockCustomerId = order.StockCustomerId
  //           new_groupOrder.StockCustomerCode = order.StockCustomerCode
  //           new_groupOrder.ProjectName = order.ProjectName
  //           new_groupOrder.ProductCode = order.ProductCode
  //           new_groupOrder.OrdersIdArray.push(order)
  //           res.push(new_groupOrder)
  //         }
  //         createNewGroupOrder = true
  //       }
  //     }
  //     return res
  //   }

  //   private convertJsonObjsToRules(rulesFromBackEnd: any): Rule[] {
  //     let rulesRes: Rule[] = []
  //     for (let rule of rulesFromBackEnd) {
  //       let a_rule = new Rule()
  //       a_rule.RuleId = rule['RuleId']
  //       a_rule.RuleName = rule['RuleName']
  //       rulesRes.push(rule)
  //       this.rulesForOptions.push(rule['RuleName'])
  //     }
  //     return rulesRes
  //   }

  //   private convertJsonObjsToStockRetailOrders(stockRetailOrders: any): StockRetailOrder[] {
  //     let stockRetailOrderRes: StockRetailOrder[] = []
  //     for (let stockRetailOrder of stockRetailOrders) {
  //       let a_stockRetailOrder = new StockRetailOrder()
  //       a_stockRetailOrder.OrderId = stockRetailOrder['OrderId']
  //       a_stockRetailOrder.RuleId = stockRetailOrder['RuleId']
  //       a_stockRetailOrder.RuleName = stockRetailOrder['RuleName']
  //       stockRetailOrderRes.push(a_stockRetailOrder)
  //     }
  //     return stockRetailOrderRes
  //   }
  //   //if all are the same, they can be grouped.
  //   //Otherwise, new group
  //   private checkSameOrder(groupOrder: GroupOrder, order: Order): boolean {
  //     return (
  //       groupOrder.StockCustomerId == order.StockCustomerId &&
  //       groupOrder.ProjectName == order.ProjectName &&
  //       groupOrder.ProductCode == order.ProductCode
  //     )
  //   }

  //   // private convertJsonObjsToWarehouses(warehousesFromBackEnd: any): Warehouse[] {
  //   //     //console.log(warehousesFromBackEnd);
  //   //     let warehouseRes: Warehouse[] = [];
  //   //     for (let warehouse of warehousesFromBackEnd){
  //   //         let a_warehouse = new Warehouse();
  //   //         a_warehouse.WarehouseId = warehouse["WarehouseId"];
  //   //         a_warehouse.WarehouseName = warehouse["WarehouseName"];
  //   //         warehouseRes.push(a_warehouse);
  //   //         this.warehouseNamesForOptions.push(warehouse["WarehouseName"]);
  //   //     }
  //   //     return warehouseRes;
  //   // }

  //   // this is to assign the orderNo to the button
  //   public changeSingleWarehouse(event: any, clickedOrder: Order): void {
  //     //console.log(clickedOrder.orderFormControl.value);

  //     let pickedRuleName = clickedOrder.orderFormControl.value
  //     if (pickedRuleName == null) {
  //       Swal.fire('请选择分仓规则！')
  //     } else {
  //       let pickedRuleId = this.returnRuleId(pickedRuleName)
  //       //console.log(pickedWarehouseId);
  //       let clickedOrderId = clickedOrder.OrderId
  //       Swal.fire({
  //         text: '确定分仓规则为 ' + pickedRuleName + ' ?',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: '确定',
  //       }).then((result) => {
  //         if (result.value) {
  //           //this.warehouseEndpoint.updateRuleToPreDispatchOrder(clickedOrderNo, pickedRuleId);
  //           let orderIds: string[] = []
  //           let ruleIds: number[] = []
  //           orderIds.push(clickedOrderId)
  //           ruleIds.push(pickedRuleId)
  //           console.log(orderIds)
  //           // this.warehouseEndpoint.updateRuleIdToStockOrders(orderIds, ruleIds)
  //           this.sweetAlertService.showSuccessMessage('操作完成！')
  //           this.refreshOrders(orderIds)
  //         }
  //       })
  //     }
  //   }

  //   public changeGroupWarehouse(event: any, clickedGroupOrder: GroupOrder): void {
  //     let pickedRuleName = clickedGroupOrder.groupOrderFormControl.value
  //     let ordersFromGroupOrder = clickedGroupOrder.OrdersIdArray
  //     // console.log(pickedRuleName);
  //     // console.log(ordersFromGroupOrder);
  //     if (pickedRuleName == null) {
  //       Swal.fire('请选择分仓规则！')
  //     } else {
  //       let pickedRuleId = this.returnRuleId(pickedRuleName)
  //       Swal.fire({
  //         text: '确定分仓规则为 ' + pickedRuleName + ' ?',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: '确定',
  //       }).then((result) => {
  //         if (result.value) {
  //           let orderIds: string[] = []
  //           let ruleIds: number[] = []
  //           for (let order of ordersFromGroupOrder) {
  //             //this.warehouseEndpoint.updateRuleToPreDispatchOrder(order.OrderNo, pickedRuleId);
  //             orderIds.push(order.OrderId)
  //             ruleIds.push(pickedRuleId)
  //           }
  //           console.log(orderIds)
  //           // this.warehouseEndpoint.updateRuleIdToStockOrders(orderIds, ruleIds)
  //           this.sweetAlertService.showSuccessMessage('操作完成！')
  //         }
  //       })
  //     }
  //   }

  //   //there must be one warehouse returned.
  //   private returnRuleId(ruleName: string): number {
  //     let theRule: Rule[] = []
  //     theRule = this.rulesArray.filter((rule) => rule.RuleName === ruleName)
  //     return theRule[0].RuleId
  //   }

  //   private returnRuleName(ruleId: number): string {
  //     let theRule: Rule[] = []
  //     theRule = this.rulesArray.filter((rule) => rule.RuleId === ruleId)
  //     return theRule[0].RuleName
  //   }
  //   private refreshOrders(ids: string[]): void {
  //     console.log(ids)
  //     for (let i = 0; i < this.ordersArray.length; i++) {
  //       for (let id of ids) {
  //         if (id == this.ordersArray[i].OrderId) {
  //           this.ordersArray.splice(i, 1)
  //         }
  //       }
  //     }
  //     this.setUpDataSource()
  //     this.setUpPaginator()

  //     this.groupOrdersArray = this.filterOrdersToGroupOrders(this.ordersArray)

  //     this.groupDataSource = new MatTableDataSource<GroupOrder>(this.groupOrdersArray)
  //     this.setUpGroupPaginator()
  //   }
  //   test(): void {
  //     // console.log(this.ordersArray);
  //     // for (let order of this.ordersArray){
  //     //     console.log(order.OrderNo, order.RuleId);
  //     // }

  //     // for (let gOrder of this.groupOrdersArrayForDisplaying){
  //     //     console.log(gOrder.OrdersIdArray[10].OrderNo, gOrder.OrdersIdArray[10].RuleId);
  //     // }
  //     console.log(this.groupOrdersArrayForDisplaying)
  //   }

  //   testDisplayWith(rule: any): string {
  //     return !(rule == null) && this.rulesForOptions.includes(rule) ? rule : ''
  //   }

  //   //set rule id to all the orders in the groupOrder
  //   public searchChangedForGroupOrder(searchValue: string, clickedGroupOrder: GroupOrder): void {
  //     let changedRuleId = this.returnRuleId(searchValue)
  //     //console.log(changedRuleId);
  //     // update each order's ruleId and its formControl to RuleName
  //     for (let order of clickedGroupOrder.OrdersIdArray) {
  //       order.RuleId = changedRuleId
  //       let newRuleName = this.returnRuleName(changedRuleId)
  //       order.orderFormControl.setValue(newRuleName)
  //     }
  //   }

  //   //When user changes rule after autoAssign, but no save
  //   public searchChanged(searchValue: string, clickedOrder: Order): void {
  //     // console.log(searchValue);
  //     // console.log(clickedOrder.OrderNo);
  //     let clickedOrderNo = clickedOrder.OrderNo
  //     let changedRuleId = this.returnRuleId(searchValue)
  //     let targetOrder: Order[] = []
  //     targetOrder = this.ordersArray.filter((order) => {
  //       if (order.OrderNo === clickedOrderNo) {
  //         return order
  //       }
  //     })
  //     targetOrder[0].RuleId = changedRuleId
  //   }

  //   // public selectionComponentCustomerContent(newCustomer): void {
  //   //     if (newCustomer) {
  //   //       this.searchedCustomer = newCustomer;
  //   //       //console.log("new customer: ", newCustomer);
  //   //     }
  //   // }

  //   // public selectionComponentProductContent(newProduct): void {
  //   //     if (newProduct) {
  //   //       this.searchedProduct = newProduct;
  //   //       //console.log("new product: ", newProduct);
  //   //     }
  //   // }

  //   //handle the orderNo from text file
  //   public ordersArrayFromTextFile(event): void {
  //     this.orderNoArrayFromText = event
  //     let filteredArray: Order[]
  //     filteredArray = this.ordersArray.filter((order) => {
  //       for (let orderNo of this.orderNoArrayFromText) {
  //         if (order.OrderNo.includes(orderNo)) {
  //           return order
  //         }
  //       }
  //     })
  //     this.dataSource = new MatTableDataSource<Order>(filteredArray)
  //     this.setUpPaginator()
  //   }

  //   // //To setup the values of two checkboxes
  //   // public projectNameFilter(result: any): void{
  //   //     this.checkCurProjectIdStatus(result);
  //   //     if (this.onLineOrder && !this.offLineOrder) {
  //   //         this.dataSource.filter = "电子单";
  //   //         this.setUpPaginator();
  //   //     } else if (!this.onLineOrder && this.offLineOrder) {
  //   //         this.dataSource.filter = "纸单";
  //   //         this.setUpPaginator();
  //   //     } else {
  //   //         this.setUpDataSource();
  //   //         this.setUpPaginator();
  //   //     }
  //   // }

  //   // private checkCurProjectIdStatus(result: string) {
  //   //     switch (result){
  //   //         case "online":
  //   //             this.onLineOrder = true;
  //   //             break;
  //   //         case "notOnline":
  //   //             this.onLineOrder = false;
  //   //             break;
  //   //         case "offOnline":
  //   //             this.offLineOrder = true;
  //   //             break;
  //   //         case "notOffOnline":
  //   //             this.offLineOrder = false;
  //   //             break;
  //   //         default:
  //   //             break;
  //   //     }
  //   // }
  //   public getFilteredValue(value: any) {
  //     // JSON.parse(value).searchString
  //     // JSON.parse(value).orderProjectNameSelected
  //     // JSON.parse(value).orderProductIdSelected
  //     // JSON.parse(value).orderCustomerIdSelected
  //     console.log(this.dataSource)
  //     if (this.dataSource) {
  //       // this.datasource.filter = JSON.parse(value).searchString;
  //       this.dataSource.filter = value
  //     }
  //   }
  //   createFilter(): (data: any, filter: string) => boolean {
  //     return function (data: any, filter: any): boolean {
  //       //
  //       let value
  //       if (data.value) value = data.value
  //       else value = data
  //       const searchTerms = JSON.parse(filter)

  //       if (searchTerms.searchString != '') {
  //         if (!findStringInObj(value, searchTerms.searchString)) return false
  //       }
  //       if (searchTerms.orderProductIdSelected)
  //         if (searchTerms.orderProductIdSelected != '') if (value.ProductId != searchTerms.orderProductIdSelected) return false

  //       if (searchTerms.orderProjectNameSelected)
  //         if (searchTerms.projectName != '') if (value.ProjectName != searchTerms.orderProjectNameSelected) return false

  //       if (searchTerms.orderCustomerIdSelected)
  //         if (searchTerms.billingCustomerId != '') if (value.BillingCustomerId != searchTerms.orderCustomerIdSelected) return false

  //       return true
  //     }
  //   }
}
