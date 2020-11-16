import { SelectionModel } from '@angular/cdk/collections'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'
import { ClientEndpoint } from '../../pages/services/endpoints/client.endpoint'
import { ProductEndpoint } from '../../pages/services/endpoints/product.endpoint'
import { NameManagementDialogComponent } from './name-management-dialog/name-management-dialog.component'

@Component({
  selector: 'app-name-management-table',
  templateUrl: './name-management-table.component.html',
  styleUrls: ['./name-management-table.component.css'],
})
export class NameManagementTableComponent implements OnInit {
  ELEMENT_DATA = []
  displayedColumns: string[] = ['select', 'position', 'name', 'mapping', 'timestamp', 'createdAt', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  selection = new SelectionModel(true, [])
  isShowTable = false
  apiBatchData = []

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: false }) sort: MatSort
  @Input() data: any
  @Input() dataType: any

  constructor(
    public dialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private clientEndpoint: ClientEndpoint,
    private productEndpoint: ProductEndpoint
  ) {}

  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData))
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row))
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row))
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  }

  async deleteBatchRows() {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.apiBatchData = []
    this.selection.selected.map((row: any) => {
      this.apiBatchData.push(row.handle.mappingId)
    })
    console.log(this.apiBatchData)
    this.productEndpoint._BatchDeleteProductNameMapping(this.apiBatchData).subscribe((_) => {
      this.sweetAlertService.successAlert('Delete succeeded！')
      const tableData = []
      this.isShowTable = false
      this.productEndpoint
        ._GetProductNameMapping()
        .toPromise()
        .then((res: any) => {
          res.map((value: any) => {
            tableData.push({
              MappingId: value.MappingId,
              Id: value.ProductId,
              Name: value.ProductCode ? value.ProductName + ' -- ' + value.ProductCode : value.ProductName,
              NameString: value.NameString,
              TimeStamp: value.TimeStamp,
              CreatedAt: value.CreatedAt,
            })
          })
          this.data = tableData
          console.log(this.data)
          this.ngOnInit()
        })
    })
  }

  ngOnInit(): void {
    this.isShowTable = false
    this.ELEMENT_DATA = []
    this.displayedColumns =
      this.dataType === 'product'
        ? ['select', 'position', 'name', 'mapping', 'timestamp', 'createdAt', 'handle']
        : ['position', 'name', 'mapping', 'createdAt', 'handle']
    this.dataSource.filterPredicate = this.createFilter()
    this.dataSource.paginator = this.paginator
    this.data.map((value: any, index: number) => {
      this.ELEMENT_DATA.push({
        position: index + 1,
        name: value.Name,
        mapping: value.NameString,
        timestamp: value.TimeStamp,
        createdAt: value.CreatedAt,
        handle: {
          status: '待处理',
          position: index + 1,
          mappingId: value.MappingId,
          id: value.Id,
        },
      })
    })
    this.dataSource.data = this.ELEMENT_DATA
    setTimeout(() => {
      this.dataSource.sortingDataAccessor = (item, property: string) => {
        switch (property) {
          case 'timestamp':
            return item['timestamp'] ? item['timestamp'] : ''
          case 'createdAt':
            return item['createdAt'] ? item['createdAt'] : ''
          default:
            return item[property]
        }
      }
      this.dataSource.sort = this.sort
    })
    console.log(this.ELEMENT_DATA)
    this.selection = new SelectionModel(true, [])
    this.isShowTable = true
  }

  getFilteredValue(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value
    }
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: any): boolean => {
      const searchTerms = JSON.parse(filter)
      return (
        data.handle.id.toString().toLowerCase().indexOf(searchTerms.orderProductIdSelected) !== -1 &&
        data.handle.id.toString().toLowerCase().indexOf(searchTerms.orderCustomerIdSelected) !== -1 &&
        data.handle.id.toString().toLowerCase().indexOf(searchTerms.orderStockCustomerIdSelected) !== -1 &&
        (data.name.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
          data.mapping.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1)
      )
    }
  }

  openNameDialog(handle) {
    const dialogRef = this.dialog.open(NameManagementDialogComponent, {})
    dialogRef.componentInstance.outputDataMapping.subscribe((result) => {
      if (result && this.dataType === 'client') {
        this.clientEndpoint
          ._PutModifyClientNameMapping(handle.mappingId, {
            customerId: handle.id,
            nameString: result,
          })
          .subscribe((_) => {
            this.sweetAlertService.successAlert('Successfully modified ')
            this.ELEMENT_DATA.map((row: any) => {
              if (row.position === handle.position) {
                row.mapping = result
                return
              }
            })
          })
      }
      if (result && this.dataType === 'product') {
        this.productEndpoint
          ._PutModifyProductNameMapping(handle.mappingId, {
            productId: handle.id,
            nameString: result,
          })
          .subscribe((_) => {
            this.sweetAlertService.successAlert('Successfully modified ')
            this.ELEMENT_DATA.map((row: any) => {
              if (row.position === handle.position) {
                row.mapping = result
                return
              }
            })
          })
      }
    })
  }

  async deleteRow(handle) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    if (this.dataType === 'client') {
      this.clientEndpoint._DeleteClientNameMapping(handle.mappingId).subscribe((_) => {
        this.sweetAlertService.successAlert('Delete succeeded！')
        this.ELEMENT_DATA.map((row: any) => {
          if (row.position === handle.position) {
            row.handle.status = '已删除'
            return
          }
        })
      })
    }
    if (this.dataType === 'product') {
      this.productEndpoint._DeleteProductNameMapping(handle.mappingId).subscribe((_) => {
        this.sweetAlertService.successAlert('Delete succeeded！')
        this.ELEMENT_DATA.map((row: any) => {
          if (row.position === handle.position) {
            row.handle.status = '已删除'
            return
          }
        })
      })
    }
  }
}
