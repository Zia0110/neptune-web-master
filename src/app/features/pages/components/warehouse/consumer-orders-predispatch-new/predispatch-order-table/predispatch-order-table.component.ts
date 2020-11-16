import { Component, OnInit, ViewChild, Input, ViewChildren, QueryList } from '@angular/core'
import { WarehouseEndpoint } from '../../../../services/endpoints/warehouse.endpoint'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import Swal from 'sweetalert2'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { MatSort } from '@angular/material/sort'
import { GroupOrder } from './groupOrder'
import { predispatchStatusFourSingleTable, predispatchStatusFourGroupTable } from '../../../../../../core/utils/utils'

@Component({
  selector: 'app-predispatch-order-table',
  templateUrl: './predispatch-order-table.component.html',
  styleUrls: ['./predispatch-order-table.component.css'],
})
export class PredispatchOrderTableComponent implements OnInit {
  @Input() statusFourFromBackEnd: any
  @Input() rulesData: any
  @Input() filterData: any

  public singleDataSource: any
  public singleColumns: string[] = ['面单类型', '订单编号', '品名简称', '仓储客户', '客服备注1', '客服备注2', '财务备注', '分仓规则']
  public groupDataSource: any
  public groupColumns: string[] = ['仓储客户', '面单类型', '品名简称', '订单数量', '分仓规则']
  public groupOrdersForTable: GroupOrder[] = []
  public rulesForOptions: string[] = []
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>()
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes): void {
    this.setUpRulesForDropDown()
    // if (this.statusFourFromBackEnd) {
    //   this.initSingleData()
    //   this.initGroupData()
    // }
    if (changes.statusFourFromBackEnd && changes.statusFourFromBackEnd.currentValue) {
      this.initSingleData()
      this.initGroupData()
    }
    if (changes.filterData && changes.filterData.currentValue) {
      this.getFilteredValue(this.filterData)
    }
  }

  private getFilteredValue(value: any) {
    if (this.singleDataSource) {
      this.singleDataSource.filter = value
    }
    if (this.groupOrdersForTable) {
      this.groupDataSource.filter = value
    }
  }

  private setUpRulesForDropDown(): void {
    this.rulesForOptions = []
    if (this.rulesData) {
      for (let rule of this.rulesData) {
        this.rulesForOptions.push(rule['RuleName'])
      }
    }
  }

  private initSingleData(): void {
    this.setFormControl()
    this.buildTable()
  }

  private setFormControl(): void {
    for (let order of this.statusFourFromBackEnd) {
      order['orderFormControl'] = new FormControl()
    }
  }

  private buildTable(): void {
    this.singleDataSource = new MatTableDataSource<any>(this.statusFourFromBackEnd)
    this.singleDataSource.filterPredicate = predispatchStatusFourSingleTable
    this.singleDataSource.paginator = this.paginator.toArray()[0]
  }

  private initGroupData(): void {
    this.groupOrdersForTable.length = 0 //every time we have to reset the array
    for (let order of this.statusFourFromBackEnd) {
      if (this.groupOrdersForTable.length == 0) {
        let new_groupOrder = new GroupOrder()
        new_groupOrder.StockCustomerId = order.StockCustomerId
        new_groupOrder.StockCustomerCode = order.StockCustomerCode
        new_groupOrder.ProjectName = order.ProjectName
        new_groupOrder.ProductId = order.ProductId
        new_groupOrder.ProductCode = order.ProductCode
        new_groupOrder.RuleId = order.RuleId
        new_groupOrder.RuleName = order.RuleName
        new_groupOrder.OrdersIdArray.push(order)
        this.groupOrdersForTable.push(new_groupOrder)
      } else {
        let createNewGroupOrder: boolean = true
        for (let groupOrder of this.groupOrdersForTable) {
          if (this.checkSameOrder(groupOrder, order)) {
            createNewGroupOrder = false
            groupOrder.OrdersIdArray.push(order)
            break //if found the same one then no need to loop the rest
          }
        }
        if (createNewGroupOrder) {
          let new_groupOrder = new GroupOrder()
          new_groupOrder.StockCustomerId = order.StockCustomerId
          new_groupOrder.StockCustomerCode = order.StockCustomerCode
          new_groupOrder.ProjectName = order.ProjectName
          new_groupOrder.ProductId = order.ProductId
          new_groupOrder.ProductCode = order.ProductCode
          new_groupOrder.RuleId = order.RuleId
          new_groupOrder.RuleName = order.RuleName
          new_groupOrder.OrdersIdArray.push(order)
          this.groupOrdersForTable.push(new_groupOrder)
        }
        createNewGroupOrder = true
      }
    }
    this.buildGroupTable()
  }

  private ruleToSingleOrder(rule, element): void {
    this.statusFourFromBackEnd.filter((order) => {
      if (order == element) {
        order['orderFormControl'].setValue(rule)
      }
    })
  }

  private ruleToGroupOrder(rule, element): void {
    this.groupOrdersForTable.filter((groupOrder) => {
      if (groupOrder == element) {
        groupOrder.groupOrderFormControl.setValue(rule)
      }
    })
  }

  private checkSameOrder(groupOrder: GroupOrder, order: any): boolean {
    return (
      groupOrder.StockCustomerId == order.StockCustomerId &&
      groupOrder.ProjectName == order.ProjectName &&
      groupOrder.ProductCode == order.ProductCode
    )
  }

  private buildGroupTable(): void {
    this.groupDataSource = new MatTableDataSource<any>(this.groupOrdersForTable)
    this.groupDataSource.filterPredicate = predispatchStatusFourGroupTable
    this.groupDataSource.paginator = this.paginator.toArray()[1]
    // this.groupDataSource.sort = this.sort
  }

  public assignRulesToAllOrders(): void {
    console.log(1234567890)
    for (let order of this.statusFourFromBackEnd) {
      order['orderFormControl'].setValue(order['RuleName'])
    }

    for (let groupOrder of this.groupOrdersForTable) {
      groupOrder.groupOrderFormControl.setValue(groupOrder.RuleName)
    }
  }

  // handle all groupOrder and single order, we need to assign comments here with null
  public handleRulesAndOrders(): any {
    console.log('im here')
    let orderIds: string[] = []
    let ruleIds: number[] = []
    let dispatchComment: string[] = []
    let dispatchComment2: string[] = []
    for (let groupOrder of this.groupOrdersForTable) {
      for (let order of groupOrder.OrdersIdArray) {
        if (groupOrder.groupOrderFormControl.value != undefined && groupOrder.groupOrderFormControl.value != '') {
          orderIds.push(order['OrderId'])
          ruleIds.push(this.findRuleId(groupOrder.groupOrderFormControl.value))
          dispatchComment.push(null)
        }
      }
    }

    for (let order of this.statusFourFromBackEnd) {
      if (!orderIds.includes(order['OrderId'])) {
        if (order['orderFormControl'].value != undefined && order['orderFormControl'].value != '') {
          orderIds.push(order['OrderId'])
          ruleIds.push(this.findRuleId(order['orderFormControl'].value))
          dispatchComment.push(null)
          dispatchComment2.push(null)
        }
      }
    }
    // console.log(orderIds);
    // console.log(ruleIds);
    let returnObject: any = {
      orderIds: orderIds,
      ruleIds: ruleIds,
      dispatchComment: dispatchComment,
      dispatchComment2: dispatchComment2,
    }
    return returnObject
  }

  private findRuleId(name: string): number {
    for (let rule of this.rulesData) {
      if (rule['RuleName'] == name) {
        return rule['RuleId']
      }
    }
  }

  private printAll(): void {
    console.log(this.statusFourFromBackEnd)
    console.log(this.rulesData)
  }

  public test() {
    console.log(this.filterData)
  }

  public test2() {
    console.log(this.groupOrdersForTable)
  }
}
