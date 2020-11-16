import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-purchase-order-stockin',
  templateUrl: './purchase-order-stockin.component.html',
  styleUrls: ['./purchase-order-stockin.component.css'],
})
export class PurchaseOrderStockinComponent implements OnInit {
  // 定义Table相关的变量
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'supplier', 'comment', 'orderno', 'summaryInfo', 'confirmCol', 'priceInfo', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  selectedBeginDate = ''
  selectedEndDate = ''

  constructor(private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit(): void {
    const now = new Date()
    const endDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const last90days = new Date(now.setDate(now.getDate() - 90))
    const startDateString = `${last90days.getFullYear()}-${last90days.getMonth() + 1}-${last90days.getDate()}`
    console.log('开始日期：' + startDateString)
    console.log('结束日期：' + endDateString)
    this.selectedBeginDate = startDateString
    this.selectedEndDate = endDateString
    this.requestApi(startDateString, endDateString)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  requestApi(startDateString, endDateString) {
    this.financeEndpoint
      ._GetPurchaseOrderByDate(startDateString, endDateString)
      .toPromise()
      .then((res: any) => {
        this.ELEMENT_DATA = []
        if (!res.length) {
          this.sweetAlertService.successAlert('暂无数据！')
        }
        if (res.length) {
          this.sweetAlertService.successAlert('Data extracted successfully！')
        }
        res.map((value: any, index: number) => {
          this.ELEMENT_DATA.push({
            position: index + 1,
            SupplierName: value.SupplierName,
            ApplyComments: value.ApplyComments,
            OrderNo: value.OrderNo,
            summaryInfo: {
              StatusName: value.StatusName,
            },
            priceInfo: {
              PurchaseOrderDetail: value.PurchaseOrderDetail,
              PurchaseOrderPrice: value.PurchaseOrderPrice,
            },
            confirmCol: {
              CreatedAt: value.CreatedAt,
              ContactPerson: value.ContactPerson,
              Phone: value.Phone,
              Email: value.Email,
              UserName: value.UserName,
            },
          })
        })
        this.dataSource.data = this.ELEMENT_DATA
        this.dataSource.paginator = this.paginator
      })
  }

  async deleteRow(data) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.financeEndpoint.deletePurchaseOrder(data).subscribe((_) => {
      this.sweetAlertService.successAlert('Delete Successfully!')
      this.getData()
    })
  }

  getData() {
    if (!this.selectedBeginDate || !this.selectedEndDate) {
      this.sweetAlertService.showSweetAlert('Please select start date and end date before querying！')
      return
    }
    this.requestApi(this.selectedBeginDate, this.selectedEndDate)
  }

  dateRangePickerOutput($event) {
    console.log($event)
    this.selectedBeginDate = $event.begin
    this.selectedEndDate = $event.end
  }
}
