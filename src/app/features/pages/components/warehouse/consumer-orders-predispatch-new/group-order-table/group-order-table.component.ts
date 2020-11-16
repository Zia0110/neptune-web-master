import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { WarehouseEndpoint } from '../../../../services/endpoints/warehouse.endpoint'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import Swal from 'sweetalert2'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { GroupOrder } from './groupOrder'
import { MatSort } from '@angular/material/sort'

@Component({
  selector: 'app-group-order-table',
  templateUrl: './group-order-table.component.html',
  styleUrls: ['./group-order-table.component.css'],
})
export class GroupOrderTableComponent implements OnInit {
  @Input() rulesData: any
  @Input() single: boolean
  @Input() statusFourFromBackEnd: any
  public groupDataSource: any
  public displayedColumns: string[] = ['仓储客户', '面单类型', '品名简称', '订单数量', '分仓规则']
  public rulesForOptions: string[] = []
  public groupOrdersForTable: GroupOrder[] = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  public stockRetailOrdersFromBackEnd: any

  constructor(private warehouseService: WarehouseEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.statusFourFromBackEnd) {
      this.groupOrdersForTable.length = 0
      this.initGroupData()
    }
    this.setUpRulesForDropDown()
  }

  private setUpRulesForDropDown(): void {
    if (this.rulesData) {
      for (let rule of this.rulesData) {
        this.rulesForOptions.push(rule['RuleName'])
      }
    }
  }

  private initGroupData(): void {
    console.log(this.groupOrdersForTable)
    for (let order of this.statusFourFromBackEnd) {
      if (this.groupOrdersForTable.length == 0) {
        let new_groupOrder = new GroupOrder()
        new_groupOrder.StockCustomerId = order.StockCustomerId
        new_groupOrder.StockCustomerCode = order.StockCustomerCode
        new_groupOrder.ProjectName = order.ProjectName
        new_groupOrder.ProductCode = order.ProductCode
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
          new_groupOrder.ProductCode = order.ProductCode
          new_groupOrder.OrdersIdArray.push(order)
          this.groupOrdersForTable.push(new_groupOrder)
        }
        createNewGroupOrder = true
      }
    }
    this.buildTable()
  }

  private buildTable(): void {
    this.groupDataSource = new MatTableDataSource<any>(this.groupOrdersForTable)
    this.groupDataSource.paginator = this.paginator
    this.groupDataSource.sort = this.sort
  }

  private checkSameOrder(groupOrder: GroupOrder, order: any): boolean {
    return (
      groupOrder.StockCustomerId == order.StockCustomerId &&
      groupOrder.ProjectName == order.ProjectName &&
      groupOrder.ProductCode == order.ProductCode
    )
  }

  public autoAssignGroup(): void {
    this.warehouseService.getStockRetailOrder().subscribe((value) => {
      this.stockRetailOrdersFromBackEnd = value
      this.assignRulesToGroupOrders()
    })
  }

  private assignRulesToGroupOrders(): void {
    console.log(this.groupOrdersForTable)
    for (let groupOrder of this.groupOrdersForTable) {
      this.stockRetailOrdersFromBackEnd.filter((stockOrder) => {
        if (stockOrder['OrderId'] == groupOrder.OrdersIdArray[0]['OrderId']) {
          groupOrder.groupOrderFormControl.setValue(stockOrder['RuleName'])
        }
      })
    }
  }

  public searchChangedForGroupOrder(rule, element): void {
    this.groupOrdersForTable.filter((groupOrder) => {
      if (groupOrder == element) {
        groupOrder.groupOrderFormControl.setValue(rule)
      }
    })
  }

  public confirmRulesGroup(): void {
    Swal.fire({
      text: '确定保存并提交所有订单？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '确定',
    }).then((result) => {
      if (result.value) {
        for (let groupOrder of this.groupOrdersForTable) {
          let orderIds: string[] = []
          let ruleIds: number[] = []
          // if user assigns rule to order, we do. otherwise not do.
          if (groupOrder.groupOrderFormControl.value != undefined && groupOrder.groupOrderFormControl.value != '') {
            for (let order of groupOrder.OrdersIdArray) {
              orderIds.push(order.OrderId)
              ruleIds.push(this.findRuleId(groupOrder.groupOrderFormControl.value))
            }
            // this.warehouseService.updateRuleIdToStockOrders(orderIds, ruleIds).subscribe((res) => {
            //     this.sweetAlertService.showSuccessMessage("预分仓提交成功！");
            //     // refresh the table
            //     // this.warehouseService.getPreDispatchOrders().subscribe((value) => {
            //     //     this.statusFourFromBackEnd = value;
            //     //     this.groupOrdersForTable.length = 0;
            //     //     this.initGroupData();
            //     // })
            // })
          }
        }
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

  test() {
    console.log(this.groupOrdersForTable)
  }
}
