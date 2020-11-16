import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { NameManagementDialogComponent } from '../../../../common-views/name-management-table/name-management-dialog/name-management-dialog.component'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'

@Component({
  selector: 'app-client-name-management',
  templateUrl: './client-name-management.component.html',
  styleUrls: ['./client-name-management.component.css'],
})
export class ClientNameManagementComponent implements OnInit {
  tableData = []
  isShowTable = false

  constructor(private clientEndpoint: ClientEndpoint, public dialog: MatDialog, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.getClientData()
  }

  getClientData() {
    this.tableData = []
    this.isShowTable = false
    this.clientEndpoint
      ._GetClientNameMapping()
      .toPromise()
      .then((res: any) => {
        res.map((value: any) => {
          this.tableData.push({
            MappingId: value.MappingId,
            Id: value.CustomerId,
            Name: value.CustomerCode ? value.CustomerCode + ' -- ' + value.CustomerName : value.CustomerName,
            NameString: value.NameString,
            CreatedAt: value.CreatedAt,
          })
        })
        this.sweetAlertService.successAlert('Data extracted successfully！')
        this.isShowTable = true
      })
  }

  openNameDialog() {
    const dialogRef = this.dialog.open(NameManagementDialogComponent, {
      data: '新建客户',
      autoFocus: false,
    })
    dialogRef.componentInstance.outputDataMapping.subscribe((result) => {
      if (result) {
        this.clientEndpoint._PostNewClientNameMapping([result]).subscribe((_) => {
          this.sweetAlertService.successAlert('Successfully created! Check to re-extract data.')
        })
      }
    })
  }
}
