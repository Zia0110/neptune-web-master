import { Component, OnInit, ViewChild } from '@angular/core'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatDialog } from '@angular/material/dialog'
import { FinanceOrderDialogComponent } from '../../orders/finance-order-dialog/finance-order-dialog.component'
import { InvoiceUpdateDialogComponent } from './invoice-update-dialog/invoice-update-dialog.component'
import { WholesaleUpdateCommentDialogComponent } from './wholesale-update-comment-dialog/wholesale-update-comment-dialog.component'

@Component({
  selector: 'app-finance-invoice-payment',
  templateUrl: './finance-invoice-payment.component.html',
  styleUrls: ['./finance-invoice-payment.component.css'],
})
export class FinanceInvoicePaymentComponent implements OnInit {
  invoicesArray = []

  displayedColumns: string[] = ['CustomerName', 'Price', 'Comment', 'CreatedAt', 'WholeSaleInvoiceDeitals', 'IsOutWareHouse', 'Action']
  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor(public dialog: MatDialog, private financeEndpoint: FinanceEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit() {
    this.getApiData()
  }

  getApiData() {
    this.financeEndpoint._getFinanceWholeSaleInvoices().subscribe((res) => {
      console.log(res), this.prepData(res)
    })
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
        this.ngOnInit()
      }
    })
  }

  prepData(datas) {
    this.dataSource = new MatTableDataSource()
    if (datas.length) {
      this.dataSource = new MatTableDataSource(datas)
      this.dataSource.paginator = this.paginator
    } else {
      this.sweetAlertService.showSuccessMessage('There is no transfer order now')
    }
    console.log(this.invoicesArray)
  }

  confirmPayment(order) {
    this.updateInvoicePaymentStatus(order.OrderId)
  }
  async deleteOrder(order) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this record！')
    if (!saveAlert.value) return
    this.financeEndpoint.deleteWholesaleOrder(order.OrderId).subscribe((res) => {
      console.log(res)
      this.sweetAlertService.showSuccessMessage('Successful !')
      this.getApiData()
    })
  }
  modifyOrder(order) {
    console.log(order)
    const dialogRef = this.dialog.open(InvoiceUpdateDialogComponent, {
      width: '100%',
      height: '97%',
      data: order,
      autoFocus: false,
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.getApiData()
      }
    })
  }

  updateInvoicePaymentStatus(id) {
    this.financeEndpoint._updateFinanceWholeSaleInvoicePaid(id).subscribe((res) => {
      console.log(res), this.sweetAlertService.showSuccessMessage('Successful payment！'), this.getApiData()
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase()
  }
}
