import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-pickup-order-dialog',
  templateUrl: './pickup-order-dialog.component.html',
  styleUrls: ['./pickup-order-dialog.component.css'],
})
export class PickupOrderDialogComponent implements OnInit {
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  displayedColumns: string[] = ['product']
  ELEMENT_DATA = {}
  allSummaryData: any

  constructor(
    public dialogRef: MatDialogRef<PickupOrderDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.data.map((value: any) => {
      if (!this.ELEMENT_DATA[value.productName.productName]) {
        this.ELEMENT_DATA[value.productName.productName] = {
          product: {
            productName: '（' + value.productCode.productCode + '）' + value.productName.productName,
            productId: value.productName.productId,
          },
        }
        this.ELEMENT_DATA[value.productName.productName][value.customer.customerName] = {
          productId: value.productName.productId,
          customerId: value.customer.customerId,
          count: value.already === 0 ? 1 : 0,
          already: value.already === 0 ? 0 : 1,
        }
        if (value.customer.customerName && !this.displayedColumns.includes(value.customer.customerName)) {
          this.displayedColumns.push(value.customer.customerName)
          if (!value.customer.customerName) {
            console.log(value)
          }
        }
      } else {
        if (!this.ELEMENT_DATA[value.productName.productName][value.customer.customerName]) {
          this.ELEMENT_DATA[value.productName.productName][value.customer.customerName] = {
            productId: value.productName.productId,
            customerId: value.customer.customerId,
            count: value.already === 0 ? 1 : 0,
            already: value.already === 0 ? 0 : 1,
          }
          if (value.customer.customerName && !this.displayedColumns.includes(value.customer.customerName)) {
            this.displayedColumns.push(value.customer.customerName)
            if (!value.customer.customerName) {
              console.log(value)
            }
          }
        } else {
          this.ELEMENT_DATA[value.productName.productName][value.customer.customerName] = {
            productId: value.productName.productId,
            customerId: value.customer.customerId,
            count: this.ELEMENT_DATA[value.productName.productName][value.customer.customerName].count += value.already === 0 ? 1 : 0,
            already: this.ELEMENT_DATA[value.productName.productName][value.customer.customerName].already += value.already === 0 ? 0 : 1,
          }
        }
      }
    })
    console.log(this.ELEMENT_DATA)
    const elementData = []
    Object.entries(this.ELEMENT_DATA).map((value, index) => {
      elementData.push(value[1])
    })
    console.log(elementData)
    console.log(this.displayedColumns)
    this.allSummaryData = new MatTableDataSource(elementData)
    this.allSummaryData.paginator = this.paginator
    this.paginator.pageIndex = JSON.parse(localStorage.getItem('pagiIndex')) ? JSON.parse(localStorage.getItem('pagiIndex')) : 0
    this.paginator.pageSize = JSON.parse(localStorage.getItem('pagiSize')) ? JSON.parse(localStorage.getItem('pagiSize')) : 10
  }

  async onNoClick(isCloseIcon, data?) {
    if (isCloseIcon) {
      this.dialogRef.close()
    } else {
      if (data) {
        const saveAlert = await this.sweetAlertService.saveAlert('如果未保存数据，切换项目可能会导致数据丢失，确认切换吗？')
        if (!saveAlert.value) {
          return
        }
        this.dialogRef.close()
        console.log(data)
        this.outputData.emit(data)
      } else {
        return
      }
    }
    localStorage.setItem('pagiIndex', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('pagiSize', JSON.stringify(this.paginator.pageSize))
  }
}
