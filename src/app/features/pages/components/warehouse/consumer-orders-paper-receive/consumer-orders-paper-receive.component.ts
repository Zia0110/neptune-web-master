import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { TableHelperService } from '../../../services/helpers/table-helper.service'
import { tableOrderPaperReceiveSearch } from '../../../../../core/utils/utils'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-consumer-orders-paper-receive',
  templateUrl: './consumer-orders-paper-receive.component.html',
  styleUrls: ['./consumer-orders-paper-receive.component.css'],
})
export class ConsumerOrdersPaperReceiveComponent implements OnInit {
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  warehouseList = []
  searchValue = new FormControl()
  warehouseSelected = new FormControl()
  batchStatus = new FormControl()
  displayedColumns: string[] = [
    // 'PapertBatchId',
    'UserName',
    'DeliveryDate',
    'ArrivalDate',
    'WarehouseName',
    'EstimatedArrivalDate',
    'StatusName',
    'Comments',
    'PaperExpressNumber',
    'function',
  ]
  batchStatusFilterSelection = [
    { value: null, view: '' },
    { value: 1, view: '已发送' },
    { value: 2, view: '已接受' },
  ]

  constructor(private warehouseEndpoint: WarehouseEndpoint, private sweetAlert: SweetAlertService) {}

  tableFunction(batch) {
    console.log(batch)

    this.updatePaperOrderBatchArrivalDateApi(batch.PapertBatchId)
  }

  ngOnInit() {
    this.getPaperOrderBatchArriveApi()
    this.getWarehousesApi()
    this.searchFormValueSub()
  }

  batchStatusOutput($event) {
    this.batchStatus.setValue($event)
  }

  searchFormValueSub() {
    let searchValues = { searchString: '', warehouse: '', batchStatus: '' }

    this.warehouseSelected.valueChanges.subscribe((value) => {
      ;(searchValues['warehouse'] = value), this.initFilter(searchValues)
    })
    this.searchValue.valueChanges.subscribe((value) => {
      ;(searchValues['searchString'] = value), this.initFilter(searchValues)
    })
    this.batchStatus.valueChanges.subscribe((value) => {
      ;(searchValues['batchStatus'] = value), this.initFilter(searchValues)
    })
  }

  initFilter(values) {
    let searchValueString = JSON.stringify(values)
    this.dataSource.filter = searchValueString
  }

  getPaperOrderBatchArriveApi() {
    this.warehouseEndpoint._getRetailOrderPaperBatchArrive().subscribe((res) => {
      console.log(res), this.prepTable(res)
    })
  }

  updatePaperOrderBatchArrivalDateApi(id) {
    this.warehouseEndpoint
      ._updateRetailOrderPaperBatchArrivalDate(id)
      .subscribe((res) => (console.log(res), this.sweetAlert.showSuccessMessage('更新成功 '), this.getPaperOrderBatchArriveApi()))
  }

  prepTable(data) {
    this.dataSource = new MatTableDataSource(data)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.dataSource.filterPredicate = tableOrderPaperReceiveSearch
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }

  getWarehousesApi() {
    this.warehouseEndpoint._getWarehousesList().subscribe((res) => {
      console.log(res), this.setWarehouses(res)
    })
  }

  setWarehouses(datas) {
    for (let data of datas) {
      this.warehouseList.push({ view: data['WarehouseName'], value: data['WarehouseId'] })
    }
  }
}
