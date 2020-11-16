import { Component, OnChanges, Input, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-warehouse-inventory-table',
  templateUrl: './warehouse-inventory-table.component.html',
  styleUrls: ['./warehouse-inventory-table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WarehouseInventoryTableComponent implements OnChanges {
  @Input() tableData: any

  displayedColumns: string[] = ['ProductId', 'ProductName', 'ProductCode', 'Uom', 'Weight', 'Quantity', 'Image']

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor(public dialog: MatDialog) {}

  ngOnChanges(): void {
    this.dataSource = null
    console.log(this.tableData)
    this.prepTable()
  }

  prepTable() {
    this.dataSource = new MatTableDataSource(this.tableData)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    // console.log(this.dataSource)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }
}
