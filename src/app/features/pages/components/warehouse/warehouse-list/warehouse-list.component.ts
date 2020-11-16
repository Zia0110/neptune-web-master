import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { WarehouseListDialogComponent } from './warehouse-list-dialog/warehouse-list-dialog.component'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css'],
})
export class WarehouseListComponent implements OnInit {
  displayedColumns: string[] = ['WarehouseId', 'WarehouseName', 'ContactPerson', 'Phone', 'Email', 'Fax', 'Website', 'WarehouseTypeName', 'actions']
  dataSource: any

  constructor(private warehouseEndpoint: WarehouseEndpoint, public dialog: MatDialog, private sweetAlertService: SweetAlertService) {}

  ngOnInit() {
    this.getWarehouseList()
  }

  getWarehouseList() {
    this.warehouseEndpoint._getWarehousesList().subscribe(
      (list) => {
        this.dataSource = list
        console.log('List:', this.dataSource)
      },
      (err) => {
        console.log('Server Error!', err)
      }
    )
  }

  openEditDialog(element) {
    const dialogRef = this.dialog.open(WarehouseListDialogComponent, {
      height: '500px',
      width: '800px',
      autoFocus: false,
      data: { data: element },
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getWarehouseList()
      }
    })
  }

  newWarehouseDialog() {
    const dialogRef = this.dialog.open(WarehouseListDialogComponent, {
      height: '500px',
      width: '800px',
      autoFocus: false,
    })

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getWarehouseList()
      }
    })
  }

  deleteWarehouse(warehouseId) {
    if (window.confirm('Sure to delete this warehouse？')) {
      this.warehouseEndpoint._deleteWarehouse(warehouseId).subscribe(
        (success) => {
          this.sweetAlertService.showSuccessMessage('Warehouse deleted')
          this.getWarehouseList()
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }
}
