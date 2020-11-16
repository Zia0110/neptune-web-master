import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
import { InventorySnapshotExcelExportMapping } from '../../../services/mappings/inventory-snapshot-excel-export.mapping'

@Component({
  selector: 'app-inventory-snapshot',
  templateUrl: './inventory-snapshot.component.html',
  styleUrls: ['./inventory-snapshot.component.css'],
})
export class InventorySnapshotComponent implements OnInit {
  customerFC = new FormControl()
  dateFC = new FormControl()
  tableData = []
  warehouseColumns = []
  excelExportValue = []
  excelExportMapping: any

  displayedColumns: string[] = ['Product']
  dataSource: any

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  constructor(private sweetAlertService: SweetAlertService, private inventoryService: InventoryEndpoint) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  ngOnInit(): void {
    this.excelExportMapping = new InventorySnapshotExcelExportMapping()
    this.customerFC.valueChanges.subscribe((res) => {
      this.query(res, this.dateFC.value)
    })
    this.dateFC.valueChanges.subscribe((res) => {
      this.query(this.customerFC.value, res)
    })
  }

  formatDate(date) {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }

  query(customerId, queryDate) {
    if (customerId && queryDate) {
      this.inventoryService.getInventorySnapshot(customerId, this.formatDate(queryDate)).subscribe((value: any) => {
        this.buildProductWarehouseTable(value) // show the table when picks customer
      })
    }
  }
  // To build table when user just picks customer, and show Product-Warehouse
  private buildProductWarehouseTable(stocks: any): void {
    this.warehouseColumns = []
    this.tableData = []
    // this.excelExportValue = this.excelExportMapping.mapping(stocks)
    stocks.map((row) => {
      if (!this.warehouseColumns.includes(row.WarehouseName)) {
        this.warehouseColumns.push(row.WarehouseName)
      }
      if (!this.IsProductIncludedInTable(row)) {
        const item = {}
        item['BaseProductId'] = row.BaseProductId
        item[row.WarehouseName] = row.Quantity
        item['ProductCode'] = row.ProductCode
        item['ProductName'] = row.ProductName
        console.log(item)
        this.tableData.push(item)
      }
    })
    this.displayedColumns = ['Product', ...this.warehouseColumns]
    // this.tableData.map(row => {
    //   this.warehouseColumns.map(warehouse => {
    //     if (!row[warehouse]) {
    //       row[warehouse] = null
    //     }
    //   })
    // })
    console.log(this.tableData)
    console.log(this.displayedColumns)
    this.dataSource = new MatTableDataSource(this.tableData)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  IsProductIncludedInTable(row) {
    for (const item of this.tableData) {
      if (item.BaseProductId === row.BaseProductId) {
        item[row.WarehouseName] = row.Quantity
        item['ProductCode'] = row.ProductCode
        item['ProductName'] = row.ProductName
        return true
      }
    }
    return false
  }
}
