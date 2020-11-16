import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { UploadExcelComponent } from '../../../../../../../shared/common-components/upload-excel/upload-excel.component'
import { FinanceEndpoint } from '../../../../../services/endpoints/finance.endpoint'
import { SpecialPriceUploadMapping } from '../../../../../services/mappings/special-price-upload-mapping'
import { SpecialCustomerItemDialogComponent } from '../special-customer-item-dialog/special-customer-item-dialog.component'

@Component({
  selector: 'app-special-customer-table',
  templateUrl: './special-customer-table.component.html',
  styleUrls: ['./special-customer-table.component.css'],
})
export class SpecialCustomerTableComponent implements OnInit {
  displayedColumns: string[] = ['customer', 'product', 'price', 'effectiveDate', 'expiryDate', 'handle']
  ELEMENT_DATA = []
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  @Input() data: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('uploadExcel') child: UploadExcelComponent
  excelExportValue = []
  excelMapping: any
  excelMappedData: any
  isShowHandle = true
  bulkUpdateData = []

  constructor(private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint, public dialog: MatDialog) {}

  ngOnInit() {
    this.excelMapping = new SpecialPriceUploadMapping()
    this.setTableContent(this.data)
    this.setExportData(this.data)
  }

  setExportData(data) {
    this.excelExportValue = []
    data.map((row) => {
      const excelRow = {}
      excelRow['客户'] = row.CustomerCode
      excelRow['产品'] = row.ProductCode
      excelRow['价格'] = row.Price
      excelRow['生效日期'] = row.EffectiveDate.slice(0, 10)
      excelRow['过期日期'] = row.ExpiryDate.slice(0, 10)
      this.excelExportValue.push(excelRow)
    })
  }

  setTableContent(data) {
    // 重设Ele_Data的值
    this.ELEMENT_DATA = []
    data.map((value: any) => {
      this.ELEMENT_DATA.push({
        CustomerCode: value.CustomerCode,
        ProductCode: value.ProductCode,
        customer: {
          customerId: value.CustomerId,
          customerName: value.CustomerName ? value.CustomerCode + ' -- ' + value.CustomerName : value.CustomerCode,
        },
        product: {
          productId: value.ProductId,
          productName: value.ProductName ? value.ProductCode + ' -- ' + value.ProductName : value.ProductCode,
        },
        price: value.Price,
        Price: value.Price,
        effectiveDate: value.EffectiveDate,
        EffectiveDate: value.EffectiveDate,
        expiryDate: value.ExpiryDate,
        ExpiryDate: value.ExpiryDate,
        handle: {
          customerId: value.CustomerId,
          customerName: value.CustomerName ? value.CustomerCode + ' -- ' + value.CustomerName : value.CustomerCode,
          productId: value.ProductId,
          productName: value.ProductName ? value.ProductCode + ' -- ' + value.ProductName : value.ProductCode,
          price: value.Price,
          effectiveDate: value.EffectiveDate,
          expiryDate: value.ExpiryDate,
          priceId: value.PriceId,
        },
      })
    })
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
    this.dataSource.sortingDataAccessor = (item, property: string) => {
      switch (property) {
        case 'customer':
          return item['customer'].customerName
        case 'product':
          return item['product'].productName
        default:
          return item[property]
      }
    }
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.dataSource.filterPredicate = this.createFilter()
  }

  getFilteredValue(value: any) {
    console.log(value)
    if (this.dataSource) {
      this.dataSource.filter = value
      this.setExportData(this.dataSource.filteredData)
    }
  }

  excelOutput(event) {
    this.child.reset()
    this.excelMappedData = this.excelMapping.mapping(event)
    // 可以拿到特殊价格excel表格上传的数据
    console.log(this.excelMappedData)
    if (this.excelMappedData.length) {
      this.financeEndpoint
        ._getBulkUpdateSpecialPrice(this.excelMappedData)
        .toPromise()
        .then((res: any) => {
          this.sweetAlertService.successAlert('Upload successfully!')
          console.log(res)
          this.bulkUpdateData = res
          this.setTableContent(res)
          this.isShowHandle = false
        })
    }
  }

  bulkUpdate() {
    this.financeEndpoint._bulkUpdateSpecialPrice(this.bulkUpdateData).subscribe((res) => {
      this.sweetAlertService.successAlert('Bulk update successfully!')
      this.isShowHandle = true
      this.bulkUpdateData = []
      this.getSpecialPrice()
    })
  }

  getSpecialPrice() {
    this.financeEndpoint
      ._getSpecialPrice()
      .toPromise()
      .then((value) => {
        this.setTableContent(value)
        this.setExportData(value)
      })
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: any): boolean => {
      const searchTerms = JSON.parse(filter)
      let selectedExpiryDate = ''
      if (searchTerms.datePicker) {
        const temDate = new Date(searchTerms.datePicker)
        const yy = temDate.getFullYear()
        const mm = temDate.getMonth() + 1
        const dd = temDate.getDate()
        selectedExpiryDate = yy + '-' + mm + '-' + dd
      }
      return (
        (searchTerms.orderProjectNameSelected ? data.order.ProjectIdNo === searchTerms.orderProjectNameSelected : true) &&
        data.product.productId.toString().toLowerCase().indexOf(searchTerms.orderProductIdSelected) !== -1 &&
        (selectedExpiryDate ? new Date(data.expiryDate.slice(0, 10)) >= new Date(selectedExpiryDate) : true) &&
        data.customer.customerId.toString().toLowerCase().indexOf(searchTerms.orderCustomerIdSelected) !== -1 &&
        data.customer.customerId.toString().toLowerCase().indexOf(searchTerms.orderStockCustomerIdSelected) !== -1 &&
        (data.customer.customerName.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
          data.product.productName.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
          data.price.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
          data.effectiveDate.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
          data.expiryDate.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1)
      )
    }
  }

  async deleteItem(priceId) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.financeEndpoint._deleteSpecialPrice(priceId).subscribe((_) => {
      this.sweetAlertService.successAlert('Successfully deleted！')
      this.financeEndpoint
        ._getSpecialPrice()
        .toPromise()
        .then((value) => this.setTableContent(value))
    })
  }

  openItemDialog(itemData?) {
    const dialogRef = this.dialog.open(SpecialCustomerItemDialogComponent, {
      data: itemData,
      autoFocus: false,
    })

    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.getSpecialPrice()
      }
    })
  }
}
