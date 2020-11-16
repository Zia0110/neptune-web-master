import { Component, OnInit, ViewChild, ViewChildren, TemplateRef, ElementRef, Input, OnChanges } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { FormArray, FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-finance-cin7-table',
  templateUrl: './finance-cin7-table.component.html',
  styleUrls: ['./finance-cin7-table.component.css'],
})
export class FinanceCin7TableComponent implements OnChanges {
  @Input() tableData: any
  selectedRowIndex = -1
  displayedColumns: string[] = ['orderRef', 'company', 'projectName', 'cin7InterCode', 'ItemPrice', 'itemQty', 'notes']

  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor() {}

  ngOnChanges(changes): void {
    if (changes.tableData && changes.tableData.currentValue) {
      this.dataSource = new MatTableDataSource()
      this.prepTable()
    }

    // if (changes.filterData && changes.filterData.currentValue) {
    //   this.getFilteredValue(this.filterData), console.log(this.filterData)
    // }
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
