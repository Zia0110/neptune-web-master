import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { ClientEndpoint } from '../../../../services/endpoints/client.endpoint'
import { ClientEmailItemDialogComponent } from '../client-email-item-dialog/client-email-item-dialog.component'

@Component({
  selector: 'app-email-management-dialog',
  templateUrl: './email-management-dialog.component.html',
  styleUrls: ['./email-management-dialog.component.css'],
})
export class EmailManagementDialogComponent implements OnInit {
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'email', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(
    public dialogRef: MatDialogRef<EmailManagementDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private clientEndpoint: ClientEndpoint,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    if (!this.data.data.length) {
      return
    }
    this.setTableContent(this.data.data)
  }

  setTableContent(data) {
    this.ELEMENT_DATA = []
    data.map((value: any, index: number) => {
      this.ELEMENT_DATA.push({
        position: index + 1,
        email: value.Email,
        handle: {
          position: index + 1,
          emailId: value.EmailId,
          email: value.Email,
        },
      })
    })
    this.dataSource.data = this.ELEMENT_DATA
  }

  closeDialog(): void {
    this.dialogRef.close()
  }

  openItemDialog(data?) {
    const dialogRef = this.dialog.open(ClientEmailItemDialogComponent, {})
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!data) {
          this.clientEndpoint._CreateClientEmail(this.data.customerId, result).subscribe((_) => {
            this.sweetAlertService.successAlert('Add successfully！')
            this.clientEndpoint
              ._GetClient(this.data.customerId)
              .toPromise()
              .then((res: any) => this.setTableContent(res.ExtraEmail))
          })
        } else {
          this.clientEndpoint._UpdateClientEmail(data.emailId, result).subscribe((_) => {
            this.sweetAlertService.successAlert('Modify successfully！')
            this.clientEndpoint
              ._GetClient(this.data.customerId)
              .toPromise()
              .then((res: any) => this.setTableContent(res.ExtraEmail))
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
    this.clientEndpoint._DeleteClientEmail(data.emailId).subscribe((_) => {
      this.sweetAlertService.successAlert('Deleted successfully！')
      this.clientEndpoint
        ._GetClient(this.data.customerId)
        .toPromise()
        .then((res: any) => this.setTableContent(res.ExtraEmail))
    })
  }
}
