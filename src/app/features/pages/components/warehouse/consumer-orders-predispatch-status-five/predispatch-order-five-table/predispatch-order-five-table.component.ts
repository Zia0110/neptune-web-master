import { Component, OnInit, ViewChild, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core'
import { WarehouseEndpoint } from '../../../../services/endpoints/warehouse.endpoint'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import Swal from 'sweetalert2'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { MatSort } from '@angular/material/sort'
import { GroupOrder } from '../../consumer-orders-predispatch-new/predispatch-order-table/groupOrder'
import { predispatchStatusFiveSingleTable, predispatchStatusFiveGroupTable } from '../../../../../../core/utils/utils'

@Component({
  selector: 'app-predispatch-order-five-table',
  templateUrl: './predispatch-order-five-table.component.html',
  styleUrls: ['./predispatch-order-five-table.component.css'],
})
export class PredispatchOrderFiveTableComponent implements OnInit {
  @Input() statusFiveFromBackEnd: any
  @Input() rulesData: any
  @Input() filterData: any
  @Input() excelData: any
  @Output() outputSelectedOrder: EventEmitter<any> = new EventEmitter<any>()

  public singleDataSource: any
  public singleColumns: string[] = [
    '面单类型',
    '订单编号',
    '品名简称',
    '仓储客户',
    '已分配分仓规则',
    '客服备注1',
    '库管备注',
    '库管备注2',
    '修改分仓规则',
  ]
  public groupDataSource: any
  public groupColumns: string[] = ['仓储客户', '面单类型', '品名简称', '订单数量', '分仓规则', '库管备注', '库管备注2', '修改分仓规则']
  public groupOrdersForTable: GroupOrder[] = []
  public rulesForOptions: string[] = []
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>()
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @Output() childEvent = new EventEmitter()

  public value = 'Clear me'

  public disableConfirmChangeButton: boolean = true
  constructor(private warehouseService: WarehouseEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {}

  ngOnChanges(changes): void {
    this.setUpRulesForDropDown()
    console.log(this.excelData)
    if (changes.statusFiveFromBackEnd && changes.statusFiveFromBackEnd.currentValue) {
      this.initSingleData()
      this.initGroupData()
    }
    if (changes.filterData && changes.filterData.currentValue) {
      this.getFilteredValue(JSON.stringify(this.filterData))
    }

    if (changes.excelData && changes.excelData.currentValue) {
      this.updateSelectedOrderFromExcel()
      let temObject = this.convertExcelDataToString()
      this.getFilteredValue(JSON.stringify(temObject))
      // this.comfirmToChangeAllFromExcel();
    }
  }

  private comfirmToChangeAllFromExcel(): void {
    let orderIds: string[] = []
    let ruleIds: number[] = []
    let commentsArray: string[] = []
    let comments2Array: string[] = []
    for (let record of this.statusFiveFromBackEnd) {
      for (let row of this.excelData) {
        if (row.OrderNo == record.OrderNo) {
          orderIds.push(record.OrderId)
          ruleIds.push(this.findRuleId(record['orderFormControl'].value))
          commentsArray.push(record.commentFormControl.value)
          comments2Array.push(record.commentFormControl2.value)
        }
      }
    }
    // orderIds.push(order['OrderId'])
    // ruleIds.push(this.findRuleId(order['orderFormControl'].value))
    // commentsArray.push(order.commentFormControl.value)
    // comments2Array.push(order.commentFormControl2.value)
    Swal.fire({
      text: 'Confirmation？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.value) {
        this.warehouseService.updateRuleIdToStockOrders(orderIds, ruleIds, commentsArray, comments2Array).subscribe((res) => {
          this.sweetAlertService.showSuccessMessage('Saved！')
          // this.childEvent.emit()
        })
      }
    })
  }

  //to update the notes 1 and 2 to the new one
  private updateSelectedOrderFromExcel(): void {
    for (let record of this.statusFiveFromBackEnd) {
      for (let row of this.excelData) {
        if (row.OrderNo == record.OrderNo) {
          record.commentFormControl.setValue(row['Notes1'])
          record.commentFormControl2.setValue(row['Notes2'])
        }
      }
    }
  }

  //needs to convert orderNo to string in this special format
  private convertExcelDataToString(): any {
    // let res = {
    //   "uploadTextArray" : []
    // }

    //must follow this format
    let res = {
      searchString: '',
      orderProjectNameSelected: null,
      orderProductIdSelected: '',
      orderCustomerIdSelected: '',
      orderStockCustomerIdSelected: '',
      orderSuspendedProducts: '',
      orderCreditCondition: '',
      uploadTextArray: [],
    }
    // let res: string[] = []
    for (let row of this.excelData) {
      res.uploadTextArray.push(row['OrderNo'].toString())
    }
    return res
  }

  private initSingleData(): void {
    this.setFormControl()
    this.buildTable()
  }

  private setFormControl(): void {
    for (let order of this.statusFiveFromBackEnd) {
      order['orderFormControl'] = new FormControl()
      order['orderFormControl'].setValue(order['RuleName'])

      order['commentFormControl'] = new FormControl()
      let temCommentValue = order['DispatchComment'] == null ? 'No Comments' : order['DispatchComment']
      order['commentFormControl'].setValue(temCommentValue)

      order['commentFormControl2'] = new FormControl()
      let temCommentValue2 = order['DispatchComment2'] == null ? 'No Comments' : order['DispatchComment2']
      order['commentFormControl2'].setValue(temCommentValue2)

      order['confirmButton'] = true
    }
  }

  private buildTable(): void {
    this.singleDataSource = new MatTableDataSource<any>(this.statusFiveFromBackEnd)
    this.singleDataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case '客服备注1':
          return item['Comment1']
        case '客服备注2':
          return item['Comment2']
        default:
          return item[property]
      }
    }
    this.singleDataSource.sort = this.sort
    this.singleDataSource.filterPredicate = predispatchStatusFiveSingleTable
    this.singleDataSource.paginator = this.paginator.toArray()[0]
  }

  private setUpRulesForDropDown(): void {
    this.rulesForOptions = []
    if (this.rulesData) {
      for (let rule of this.rulesData) {
        this.rulesForOptions.push(rule['RuleName'])
      }
    }
  }

  private ruleToSingleOrder(rule, element): void {
    element.orderFormControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          // console.log(value)
          element.confirmButton = false
        }
      })
    })

    this.statusFiveFromBackEnd.filter((order) => {
      if (order == element) {
        //here we assign new rule name to control not the RULEID
        // so after we post to api, it changes.
        order['orderFormControl'].setValue(rule)
      }
    })
  }

  public changeCommmentOne(element): void {
    // console.log(element)
    element.commentFormControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          console.log(value)
          element.confirmButton = false
        }
      })
    })
  }

  public changeCommmentTwo(element): void {
    element.commentFormControl2.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          // console.log(value)
          element.confirmButton = false
        }
      })
    })
  }

  // public enableConfirmChangeButton(): void {
  //   this.disableConfirmChangeButton = false;
  // }

  public changeSingleRule(order): void {
    console.log(order)
    let orderIds: string[] = []
    let ruleIds: number[] = []
    let commentsArray: string[] = []
    let comments2Array: string[] = []
    orderIds.push(order['OrderId'])
    ruleIds.push(this.findRuleId(order['orderFormControl'].value))
    commentsArray.push(order.commentFormControl.value)
    comments2Array.push(order.commentFormControl2.value)
    console.log(comments2Array)
    Swal.fire({
      text: 'Confirmation？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.value) {
        this.warehouseService.updateRuleIdToStockOrders(orderIds, ruleIds, commentsArray, comments2Array).subscribe((res) => {
          order.confirmButton = true
          this.sweetAlertService.showSuccessMessage('Saved！')
          // this.childEvent.emit()
        })
      }
    })
  }

  private findRuleId(name: string): number {
    for (let rule of this.rulesData) {
      if (rule['RuleName'] == name) {
        return rule['RuleId']
      }
    }
  }

  private initGroupData(): void {
    this.groupOrdersForTable.length = 0 //every time we have to reset the array
    for (let order of this.statusFiveFromBackEnd) {
      if (this.groupOrdersForTable.length == 0) {
        let new_groupOrder = new GroupOrder()
        new_groupOrder.StockCustomerId = order.StockCustomerId
        new_groupOrder.StockCustomerCode = order.StockCustomerCode
        new_groupOrder.ProjectName = order.ProjectName
        new_groupOrder.ProductId = order.ProductId
        new_groupOrder.ProductCode = order.ProductCode
        new_groupOrder.RuleId = order.RuleId
        new_groupOrder.RuleName = order.RuleName
        new_groupOrder.groupOrderFormControl.setValue(order.RuleName)

        let temCommentValue = order['DispatchComment'] == null ? 'No Comments' : order['DispatchComment']
        new_groupOrder.commentFromControl.setValue(temCommentValue)

        let temComment2Value = order['DispatchComment2'] == null ? 'No Comments' : order['DispatchComment2']
        new_groupOrder.commentFromControl2.setValue(temComment2Value)

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
          new_groupOrder.groupOrderFormControl.setValue(order.RuleName)

          let temCommentValue = order['DispatchComment'] == null ? 'No Comments' : order['DispatchComment']
          new_groupOrder.commentFromControl.setValue(temCommentValue)

          let temComment2Value = order['DispatchComment2'] == null ? 'No Comments' : order['DispatchComment2']
          new_groupOrder.commentFromControl2.setValue(temComment2Value)

          new_groupOrder.OrdersIdArray.push(order)
          this.groupOrdersForTable.push(new_groupOrder)
        }
        createNewGroupOrder = true
      }
    }
    this.buildGroupTable()
  }

  private checkSameOrder(groupOrder: GroupOrder, order: any): boolean {
    return (
      groupOrder.StockCustomerId == order.StockCustomerId &&
      groupOrder.ProjectName == order.ProjectName &&
      groupOrder.ProductCode == order.ProductCode &&
      // the logic has changed coz they may have changed the initial rule.
      // for example: should be rule-5, but they have changed to rule-17.
      // therefore, we have to list it as a new groupOrder
      groupOrder.groupOrderFormControl.value == order.RuleName
    )
  }

  private buildGroupTable(): void {
    this.groupDataSource = new MatTableDataSource<any>(this.groupOrdersForTable)
    this.groupDataSource.filterPredicate = predispatchStatusFiveGroupTable
    this.groupDataSource.paginator = this.paginator.toArray()[1]
    // this.groupDataSource.sort = this.sort
  }

  public ruleToGroupOrder(rule, element): void {
    element.groupOrderFormControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          // console.log(value)
          element.enableConfirmButton = false
        }
      })
    })

    this.groupOrdersForTable.filter((groupOrder) => {
      if (groupOrder == element) {
        groupOrder.groupOrderFormControl.setValue(rule)
      }
    })
  }

  public changeGroupCommentOne(groupOrder: GroupOrder): void {
    groupOrder.commentFromControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          // console.log(value)
          groupOrder.enableConfirmButton = false
        }
      })
    })
  }

  public changeGroupCommentTwo(groupOrder: GroupOrder): void {
    groupOrder.commentFromControl2.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          // console.log(value)
          groupOrder.enableConfirmButton = false
        }
      })
    })
  }

  public changeGroupRule(groupOrder: GroupOrder): void {
    let orderIds: string[] = []
    let ruleIds: number[] = []
    let commentsArray: string[] = []
    let comments2Array: string[] = []
    for (let order of groupOrder.OrdersIdArray) {
      orderIds.push(order['OrderId'])
      ruleIds.push(this.findRuleId(groupOrder.groupOrderFormControl.value))
      commentsArray.push(groupOrder.commentFromControl.value)
      comments2Array.push(groupOrder.commentFromControl2.value)
    }
    console.log(groupOrder)
    Swal.fire({
      text: 'Confirmation？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'confirm',
    }).then((result) => {
      if (result.value) {
        this.warehouseService.updateRuleIdToStockOrders(orderIds, ruleIds, commentsArray, comments2Array).subscribe((res) => {
          this.sweetAlertService.showSuccessMessage('saved！')
          groupOrder.enableConfirmButton = true
          // this.childEvent.emit()
        })
      }
    })
  }

  private getFilteredValue(value: any) {
    console.log(value)
    if (this.singleDataSource) {
      this.singleDataSource.filter = value
      this.outputSelectedOrder.emit(this.singleDataSource.filteredData)
    }
    if (this.groupOrdersForTable) {
      this.groupDataSource.filter = value
    }
  }

  public TestGroup() {
    console.log(this.groupOrdersForTable)
    // this.childEvent.emit('this is a test');
    // this.childEvent.emit();
  }
}
