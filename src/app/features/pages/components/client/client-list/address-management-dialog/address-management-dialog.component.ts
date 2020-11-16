import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { ClientEndpoint } from '../../../../services/endpoints/client.endpoint'
import { AddressItemDialogComponent } from '../address-item-dialog/address-item-dialog.component'

@Component({
  selector: 'app-address-management-dialog',
  templateUrl: './address-management-dialog.component.html',
  styleUrls: ['./address-management-dialog.component.css'],
})
export class AddressManagementDialogComponent implements OnInit {
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'address', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

  constructor(
    public dialogRef: MatDialogRef<AddressManagementDialogComponent>,
    public dialog: MatDialog,
    private clientEndpoint: ClientEndpoint,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.clientEndpoint
      ._GetAllAddress()
      .toPromise()
      .then((value: any) => {
        if (!value.length) {
          this.sweetAlertService.successAlert('No data！')
        } else {
          this.setTableContent(value)
        }
      })
  }

  setTableContent(data) {
    this.dataSource.paginator = this.paginator
    this.ELEMENT_DATA = []
    data.map((value: any, index: number) => {
      this.ELEMENT_DATA.push({
        position: index + 1,
        address: {
          address: value.Address,
          suburb: value.Suburb,
          city: value.City,
          state: value.State,
        },
        handle: {
          position: index + 1,
          addressId: value.AddressId,
          address: {
            address: value.Address,
            suburb: value.Suburb,
            city: value.City,
            state: value.State,
          },
        },
      })
    })
    this.dataSource.data = this.ELEMENT_DATA
  }

  closeDialog(): void {
    this.dialogRef.close()
  }

  openItemDialog(handle?) {
    const dialogRef = this.dialog.open(AddressItemDialogComponent, {
      data: handle ? handle.address : null,
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!handle) {
          this.clientEndpoint._CreateAddress(result).subscribe((_) => {
            this.sweetAlertService.successAlert('Add successfully！')
            this.clientEndpoint
              ._GetAllAddress()
              .toPromise()
              .then((res: any) => this.setTableContent(res))
          })
        } else {
          this.clientEndpoint._UpdateAddress(handle.addressId, result).subscribe((_) => {
            this.sweetAlertService.successAlert('Modified successfully！')
            this.clientEndpoint
              ._GetAllAddress()
              .toPromise()
              .then((res: any) => this.setTableContent(res))
          })
        }
      }
    })
  }

  async deleteItem(data) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.clientEndpoint._DeleteAddress(data.addressId).subscribe((_) => {
      this.sweetAlertService.successAlert('Deleted successfully！')
      this.clientEndpoint
        ._GetAllAddress()
        .toPromise()
        .then((res: any) => this.setTableContent(res))
    })
  }
}
