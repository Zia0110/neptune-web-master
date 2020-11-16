import Swal from 'sweetalert2'
import { Component, OnChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { FinanceEndpoint } from '../../pages/services/endpoints/finance.endpoint'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-finance-credit-table',
  templateUrl: './finance-credit-table.component.html',
  styleUrls: ['./finance-credit-table.component.css'],
})
export class FinanceCreditTableComponent implements OnChanges {
  @Input() tableData: any
  @Input() filterData: any
  @Output() outputOrder: EventEmitter<any> = new EventEmitter<any>()
  selectedRowIndex: number = -1

  displayedColumns: string[] = ['订单号', '类型', '客户', '原本订单信息', '新订单信息', 'Credit', '日期', '备注', 'CreditNo', 'Cin7No', '处理']

  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor(private financeEndpoint: FinanceEndpoint, public dialog: MatDialog, private sweetalert: SweetAlertService) {}

  ngOnChanges(changes): void {
    // console.log(changes)
    if (changes.tableData && changes.tableData.currentValue) {
      this.dataSource = new MatTableDataSource()
      this.prepTable()
    }
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  prepTable() {
    console.log(this.tableData)
    this.dataSource = new MatTableDataSource(this.tableData)
    this.dataSource.paginator = this.paginator
  }

  async updateCloseCredit(order) {
    console.log(order)
    const { value: creditNo } = await Swal.fire({
      title: 'Input credit number',
      input: 'text',
      inputPlaceholder: 'Enter credit number',
    })
    if (creditNo) {
      this.updateOrderForCloseCreditApi(order.CreditId, creditNo, order.OrderNo)
    }
  }

  updateOrderForCloseCreditApi(creditID, creditNo, orderNum) {
    this.financeEndpoint._updateCreditProcessed(creditID, creditNo).subscribe((res) => {
      console.log(res), this.sweetalert.showSuccessMessage('Successfully processed')

      for (let data of this.tableData) {
        if (data.OrderNo == orderNum) {
          data.IsClosed = 1
          data.CreditNo = creditNo
        }
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }
}
