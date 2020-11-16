import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-warehouse-inventory-transfer-notice-table',
  templateUrl: './warehouse-inventory-transfer-notice-table.component.html',
  styleUrls: [],
})
export class WarehouseInventoryTransferNoticeTableComponent implements OnInit {
  endDate = ''
  startDate = ''
  displayedColumns: string[] = [
    // 'warehouse',
    'originCustomer',
    'destinationCustomer',
    'product',
    'quantity',
    // 'actions'
  ]
  @Input() tableData: any

  dataSource: MatTableDataSource<any>

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild('excelExporter') excelExporter

  excelExportMapping: any
  excelExportValue: any

  constructor() {}

  ngOnInit() {
    console.log(this.tableData)
    this.dataSource = new MatTableDataSource(this.tableData)
  }
}
