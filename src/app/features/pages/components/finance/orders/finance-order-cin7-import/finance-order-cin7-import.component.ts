import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-finance-order-cin7-import',
  templateUrl: './finance-order-cin7-import.component.html',
  styleUrls: ['./finance-order-cin7-import.component.css'],
})
export class FinanceOrderCin7ImportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'cin7InvoiceNo', 'reference', 'orderNo']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  isShowNotice = true
  isReference = true
  type = 0

  constructor(private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit(): void {}

  excelOutput(event) {
    //1 refernce 2 Order no  3
    if (event.length) {
      this.setDisplayedColumns(this.type)

      this.isShowNotice = false
      this.ELEMENT_DATA = []
      this.sweetAlertService.successAlert('Uploaded successfully！')
      for (const row of event) {
        const entry = Object.entries(row)
        const element = this.setElement(entry, this.type)
        this.ELEMENT_DATA.push(element)
      }
      // event.map((row) => {
      // for
      //   const entry = Object.entries(row)
      //   this.ELEMENT_DATA.push({
      //     this.setElement(entry,type)
      //   })
      // })
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator
    } else {
      this.sweetAlertService.showSweetAlert('Uploaded file is empty, please upload again！')
      this.ELEMENT_DATA = []
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator
    }
  }
  setDisplayedColumns(type) {
    if (type == 1) this.displayedColumns = ['position', 'cin7InvoiceNo', 'reference']
    else if (type == 2) this.displayedColumns = ['position', 'cin7InvoiceNo', 'orderNo']
    else this.displayedColumns = ['position', 'reference', 'orderNo']
  }
  setElement(entry, type) {
    if (type == 1)
      return {
        cin7InvoiceNo: entry[0][1],
        reference: entry[1][1],
      }
    else if (type == 2)
      return {
        cin7InvoiceNo: entry[0][1],
        orderNo: entry[1][1],
      }
    else
      return {
        reference: entry[0][1],
        orderNo: entry[1][1],
      }
  }
  onSubmit() {
    let fun,
      cin7inv = []
    if (this.type == 1) {
      this.ELEMENT_DATA.map((e) => {
        cin7inv.push({
          cin7InvoiceNo: e.cin7InvoiceNo,
          reference: e.reference,
        })
      })
      fun = this.financeEndpoint._postCin7Import(cin7inv)
    } else if (this.type == 2) {
      this.ELEMENT_DATA.map((e) => {
        cin7inv.push({
          cin7InvoiceNo: e.cin7InvoiceNo,
          orderNo: e.orderNo,
        })
      })
      fun = this.financeEndpoint._postCin7ImportAsOrder(cin7inv)
    } else {
      this.ELEMENT_DATA.map((e) => {
        cin7inv.push({
          reference: e.reference,
          orderNo: e.orderNo,
        })
      })
      fun = this.financeEndpoint._postReferenceImportOrderNo(cin7inv)
    }
    fun.subscribe((_) => {
      this.sweetAlertService.successAlert('Saved successfully！')
      this.ELEMENT_DATA = []
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator
      this.isShowNotice = true
    })
  }
}
