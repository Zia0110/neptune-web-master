import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { environment } from '../../../../environments/environment.prod'

@Component({
  selector: 'app-transport-logistics-invoice-table',
  templateUrl: './transport-logistics-invoice-table.component.html',
  styleUrls: ['./transport-logistics-invoice-table.component.css'],
})
export class TransportLogisticsInvoiceTableComponent implements OnChanges {
  imageUrl = environment.imageBaseUrl
  @Input() tableData: any

  displayedColumns: string[] = ['client', 'type', 'invoice', 'invoiceNo', 'dates', 'isread']
  dataSource = new MatTableDataSource()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor() {}

  ngOnChanges(changes): void {
    if (changes.tableData && changes.tableData.currentValue) {
      this.dataSource = new MatTableDataSource()
      this.prepTable()
    }
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  markAllCheck(check: boolean) {
    for (let data of this.dataSource.filteredData) {
      if (data['IsConfirmed'] != 1) {
        data['IsConfirmed'] = check
      }
    }
    // console.log(this.tableData)
  }

  prepTable() {
    // console.log(this.tableData)
    this.dataSource = new MatTableDataSource(this.tableData)

    this.dataSource.paginator = this.paginator

    // console.log(this.dataSource)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }
}
