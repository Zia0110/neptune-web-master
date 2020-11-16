import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core'
import { WarehouseEndpoint } from '../../../../services/endpoints/warehouse.endpoint'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import Swal from 'sweetalert2'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-single-order-table',
  templateUrl: './single-order-table.component.html',
  styleUrls: ['./single-order-table.component.css'],
})
export class SingleOrderTableComponent implements OnInit {
  @Input() rulesData: any
  @Input() single: boolean // if single, no single order confirm
  @Input() statusFourFromBackEnd: any
  public dataSource: any
  public displayedColumns: string[] = ['面单类型', '订单编号', '品名简称', '客户', '分仓规则']
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  public rulesForOptions: string[] = []
  public stockRetailOrdersFromBackEnd: any
  @Output() someEvent = new EventEmitter<any>()

  constructor(private warehouseService: WarehouseEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (!this.single) {
      this.displayedColumns = ['面单类型', '订单编号', '品名简称', '客户', '分仓规则', '确认修改']
    }
    if (this.statusFourFromBackEnd) {
      this.initStatusFourData()
    }
    this.setUpRulesForDropDown()
  }

  private initStatusFourData(): void {
    this.setFormControl()
    this.buildTable()
  }

  private setFormControl(): void {
    for (let order of this.statusFourFromBackEnd) {
      order['orderFormControl'] = new FormControl()
    }
  }

  private buildTable(): void {
    this.dataSource = new MatTableDataSource<any>(this.statusFourFromBackEnd)
    this.dataSource.paginator = this.paginator
  }

  private setUpRulesForDropDown(): void {
    if (this.rulesData) {
      for (let rule of this.rulesData) {
        this.rulesForOptions.push(rule['RuleName'])
      }
    }
  }

  public searchChanged(rule, element): void {
    this.statusFourFromBackEnd.filter((order) => {
      if (order == element) {
        order['orderFormControl'].setValue(rule)
      }
    })
  }

  public changeSingleWarehouse(rule, element): void {}

  public autoAssignSingle(): void {
    this.warehouseService.getStockRetailOrder().subscribe((value) => {
      this.stockRetailOrdersFromBackEnd = value
      this.assignRulesToOrders()
    })
  }

  private assignRulesToOrders(): void {
    for (let order of this.statusFourFromBackEnd) {
      this.stockRetailOrdersFromBackEnd.filter((stockOrder) => {
        if (stockOrder['OrderId'] == order['OrderId']) {
          order['orderFormControl'].setValue(stockOrder['RuleName'])
        }
      })
    }
  }

  public comfirmRulesSingle(): void {
    console.log(123)
    Swal.fire({
      text: '确定保存并提交所有订单？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '确定',
    }).then((result) => {
      if (result.value) {
        let orderIds: string[] = []
        let ruleIds: number[] = []
        for (let order of this.statusFourFromBackEnd) {
          // if user assigns rule to order, we do. otherwise not do.
          if (order['orderFormControl'].value != undefined && order['orderFormControl'].value != '') {
            orderIds.push(order.OrderId)
            ruleIds.push(this.findRuleId(order['orderFormControl'].value))
          }
        }
        // this.warehouseService.updateRuleIdToStockOrders(orderIds, ruleIds).subscribe((res) => {
        //   this.sweetAlertService.showSuccessMessage("预分仓提交成功！");
        //   this.someEvent.next();
        //   // refresh the table
        //   // this.warehouseService.getPreDispatchOrders().subscribe((value) => {
        //   //   this.statusFourFromBackEnd = value;
        //   //   this.initStatusFourData();
        //   // })
        // })
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

  public test(): void {
    // console.log(this.statusFourFromBackEnd);
    console.log(this.rulesData)
  }
}

/*
 */
