import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../../services/endpoints/finance.endpoint'
import { InvoiceUpdateItemDialogComponent } from '../invoice-update-item-dialog/invoice-update-item-dialog.component'
import { FormControl } from '@angular/forms'
import { WholesaleUpdateCommentDialogComponent } from '../../finance-invoice-payment/wholesale-update-comment-dialog/wholesale-update-comment-dialog.component'

@Component({
  selector: 'app-invoice-update-table',
  templateUrl: './invoice-update-table.component.html',
  styleUrls: ['./invoice-update-table.component.css'],
})
export class InvoiceUpdateTableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['customer', 'inclGst', 'isStockCustomerSale', 'createdAt', 'paidAt', 'configures', 'comment', 'handle']
  ELEMENT_DATA = []
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  @Input() data: any
  @Output() outData = new EventEmitter()
  @Output() deleteOutData = new EventEmitter()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor(private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint, public dialog: MatDialog) {}

  ngOnInit() {
    this.setTableContent(this.data)
  }

  ngOnChanges(changes): void {
    if (changes.data && changes.data.currentValue) {
      this.setTableContent(this.data)
    }
  }

  setTableContent(data) {
    // 重设Ele_Data的值
    this.ELEMENT_DATA = []
    data.map((value: any) => {
      this.ELEMENT_DATA.push({
        OrderId: value.OrderId,
        customer: {
          customerId: value.CustomerId,
          customerName: value.CustomerCode + ' -- ' + value.CustomerName,
        },
        inclGst: value.InclGst ? 'Yes' : 'No',
        isStockCustomerSale: value.IsStockCustomerSale === false ? 'No' : 'Yes',
        createdAt: value.CreatedAt,
        comment: value.Comment,
        Comment: value.Comment,
        paidAt: value.PaidAt,
        configures: value.Configures,
        handle: value,
      })
    })
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
    this.dataSource.sortingDataAccessor = (item, property: string) => {
      if (property === 'customer') {
        return item['customer'].customerName
      } else {
        return item[property]
      }
    }
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  openCommentDialog(element) {
    console.log(element)
    const dialogRef = this.dialog.open(WholesaleUpdateCommentDialogComponent, {
      width: '250px',
      data: {
        OrderId: element.OrderId,
        Comment: element.Comment,
      },
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.outData.emit(true)
      }
    })
  }

  openItemDialog(itemData?) {
    const dialogRef = this.dialog.open(InvoiceUpdateItemDialogComponent, {
      width: '100%',
      height: '97%',
      data: itemData,
      autoFocus: false,
    })

    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.outData.emit(true)
      }
    })
  }

  deleteRow(data) {
    this.deleteOutData.emit(data)
  }
}
