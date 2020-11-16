import { Component, OnInit, Input, ViewChild, OnChanges, Output, EventEmitter } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { environment } from '../../../../environments/environment.prod'

@Component({
  selector: 'app-inventory-client-purchase-table',
  templateUrl: './inventory-client-purchase-table.component.html',
  styleUrls: ['./inventory-client-purchase-table.component.css'],
})
export class InventoryClientPurchaseTableComponent implements OnChanges {
  imageUrl = environment.imageBaseUrl
  @Input() tableData: any
  @Output() deleteRowEmit = new EventEmitter()

  displayedColumns: string[] = [
    'CustomerId',
    'BaseProductId',
    'Comment',
    'CreatedAt',
    'image',
    'Quantity',
    'Warehouse',
    'handle',
    // 'action',
  ]
  dataSource = new MatTableDataSource()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor() {}

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  ngOnChanges(changes): void {
    if (changes.tableData && changes.tableData.currentValue) {
      this.dataSource = new MatTableDataSource()
      this.prepTable()
    }
  }

  deleteRow(data) {
    this.deleteRowEmit.emit(data)
  }

  prepTable() {
    console.log(this.tableData)
    this.dataSource = new MatTableDataSource(this.tableData)

    this.dataSource.paginator = this.paginator

    // console.log(this.dataSource)
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }
}
