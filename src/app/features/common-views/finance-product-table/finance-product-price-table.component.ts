import { Component, Input, OnChanges, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { AppConfigStore } from '../../../core/services/app-config.store'

@Component({
  selector: 'app-finance-product-price-table',
  templateUrl: './finance-product-price-table.component.html',
  styleUrls: ['./finance-product-price-table.component.css'],
})
export class FinanceProductPriceTableComponent implements OnChanges {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  datasource: MatTableDataSource<any>
  displayedColumns: string[]
  customerGroup: any
  @Input() tableData: any
  @Input() tableTypeColumns: any

  constructor(public dialog: MatDialog, private appConfigStore: AppConfigStore) {}

  ngOnChanges(): void {
    console.log(this.tableData)
    this.getDisplayColumns()
    if (this.tableData) {
      this.datasource = new MatTableDataSource(this.tableData)
      // console.log(this.priceListFA.controls)
      this.datasource.paginator = this.paginator
      // this.datasource.filterPredicate = (data: FormGroup, filter: string) => {
      //   console.log(data.controls)
      //   console.log((data.controls.productCode))
      //   return (data.controls.productCode.value == JSON.parse(filter));
      // };
    }
  }

  // getLocateDateString(date) {
  //   date = date ? date + ' 24:00:00' : date
  //   return date ? new Date(this.getUTCdate(date).replace('T', ' ') + ' UTC') : date
  // }
  //
  // getUTCdate(dateString) {
  //   return dateString ? new Date(dateString).toISOString().replace(/\..+/, '') : dateString
  // }

  getDisplayColumns() {
    // this.customerGroup = this.appConfigStore.appSettings.Mapping.CustomerGroup1
    // console.log(this.customerGroup)
    const list = [' ', 'cinCode']
    for (const i of this.tableTypeColumns) {
      list.push(i)
    }
    list.push('productEffectiveDate')
    list.push('productExp')
    this.displayedColumns = list
    // console.log(this.displayedColumns)
  }
}
