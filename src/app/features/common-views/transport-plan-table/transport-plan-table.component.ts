import { Component, OnChanges, Input, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { TransportPlanEditDialogComponent } from '../../pages/components/transport/transport-plan-edit-dialog/transport-plan-edit-dialog.component'
import { TransportArriveConfirmDialogComponent } from '../../pages/components/transport/transport-arrive-confirm-dialog/transport-arrive-confirm-dialog.component'
import { TransportEndpoint } from '../../pages/services/endpoints/transport.endpoint'
import { TransportStockRealtimeDialogComponent } from '../../pages/components/transport/transport-stock-realtime-dialog/transport-stock-realtime-dialog.component'

@Component({
  selector: 'app-transport-plan-table',
  templateUrl: './transport-plan-table.component.html',
  styleUrls: ['./transport-plan-table.component.css'],
})
export class TransportPlanTableComponent implements OnChanges {
  @Input() tableData: any
  @Output() deleteRowEmit = new EventEmitter()
  @Input() filter: any

  displayedColumns: string[] = [
    'TransportNo',
    'WarehouseId',
    'FromWarehouseId',
    'Comment',
    'CreatedAt',
    'DepartureTime',
    'EstimatedArrivalTime',
    'ArrivalTime',
    'TransportTypeName',
    'AppliedUserName',
    'ComfirmUserName',
    'Status',
    'actions',
  ]

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  originTypes: any

  constructor(
    private transportEndpoint: TransportEndpoint,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private appConfigData: AppConfigStore
  ) {
    this.originTypes = this.appConfigData.appSettings.Mapping.Warehouse
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  ngOnChanges(changes): void {
    // console.log(this.tableData)
    if (this.tableData) {
      this.dataSource = null
      this.prepTable()
    }
    if (changes.filter && changes.filter.currentValue) {
      this.applyFilter(changes.filter)
    }
  }

  deleteRow(data) {
    this.deleteRowEmit.emit(data)
  }

  prepTable() {
    this.dataSource = new MatTableDataSource(this.tableData)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    console.log(this.dataSource)
  }

  rowActionOpenDetails(rowData) {
    const dialogRef = this.dialog.open(TransportPlanEditDialogComponent, {
      width: '95vw',
      maxWidth: '95vw',
      height: '80%',
      data: rowData,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.updateNewDataOnSucessUpdate(rowData.TransportId)
    })
  }

  rowActionOpenConfirm(rowData) {
    const dialogRef = this.dialog.open(TransportArriveConfirmDialogComponent, {
      width: '95vw',
      maxWidth: '95vw',
      height: '80%',
      data: rowData,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.updateNewDataOnSucessUpdate(rowData.TransportId)
    })
  }

  rowActionOpenStockDetails(rowData) {
    const dialogRef = this.dialog.open(TransportStockRealtimeDialogComponent, {
      width: '95vw',
      maxWidth: '1000px',
      height: '80%',
      data: rowData,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.updateNewDataOnSucessUpdate(rowData.TransportId)
    })
  }

  updateNewDataOnSucessUpdate(transportId) {
    this.transportEndpoint._getTransportPlanById(transportId).subscribe((res) => {
      console.log(res)
      this.replaceOldRowData(res[0])

      this.dataSource._updateChangeSubscription()
    })
  }

  replaceOldRowData(newData) {
    for (let oldIndex in this.tableData) {
      if (this.tableData[oldIndex].TransportId == newData.TransportId) {
        console.log('now')
        this.tableData[oldIndex] = newData
        return
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }

  applyFilter(event) {
    // console.log(event)
    const filterValue = event.currentValue
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
}
