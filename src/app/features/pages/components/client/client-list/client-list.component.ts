import { filter } from 'rxjs/operators'
import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { DeleteDialogComponent } from '../../../../../shared/common-components/delete-dialog/delete-dialog.component'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'
import { ClientDetailEditComponent } from '../client-detail-edit/client-detail-edit.component'
import { AddressManagementDialogComponent } from './address-management-dialog/address-management-dialog.component'
import { EmailManagementDialogComponent } from './email-management-dialog/email-management-dialog.component'
import { Router } from '@angular/router'
import { UserState } from '../../../../../core/user/user.state'

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
})
export class ClientListComponent implements OnInit {
  // 生成table
  displayedColumns: string[] = ['客户名', '客户编号', '客户等级', '联系人信息', 'FirstName', 'image', 'functions']
  dataSource = new MatTableDataSource()
  @ViewChild('excelExporter') excelExporter
  excelExportValue = []

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  // dont worry about the filter for now
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  constructor(
    public userState: UserState,
    public router: Router,
    public dialog: MatDialog,
    private clientEndpoint: ClientEndpoint,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit() {
    this.getClientListApiData()
  }

  viewClientDashboard(clientId) {
    // this.userState.paramsHold = {clientview:clientId}
    this.router.navigate(['/admin/client/dashboard/' + clientId])
  }

  // this function calls API
  getClientListApiData() {
    this.clientEndpoint._getClientsList().subscribe((res) => {
      this.assignData(res)
    })
  }

  // Assigns the retunred data to datasource
  assignData(data) {
    //remove dal row .
    data = data.filter((row) => row.CutomerGroupId2 != 1)
    data.map((row) => {
      this.excelExportValue.push({
        CustomerName: row.CustomerName,
        CustomerCode: row.CustomerCode,
        FirstName: row.FirstName,
        Reference: row.Reference,
        BillingAddress: row.BillingAddress,
        BillingContactPerson: row.BillingContactPerson,
        BillingCycleName: row.BillingCycleName,
        BillingEmail: row.BillingEmail,
        Comments: row.Comments,
        ContactPerson: row.ContactPerson,
        CustomerGroup1: row.CustomerGroup1,
        CustomerGroup2: row.CustomerGroup2,
        CustomerGroup3: row.CustomerGroup3,
        DeliveryAddress: row.DeliveryAddress,
        Fax: row.Fax,
        Phone: row.Phone,
        Website: row.Website,
      })
    })
    this.dataSource = new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  addNewClient() {
    this.openEditDialog()
  }

  openDeleteDialog(element) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        dialogLabel: '客户',
        name: element.CustomerName,
      },
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    })
  }

  openEditDialog(clientData?): void {
    this.clientEndpoint._GetAllAddress().subscribe((res) => {
      const dialogRef = this.dialog.open(ClientDetailEditComponent, {
        width: '1250px',
        data: clientData
          ? {
              addressData: res,
              client: clientData,
            }
          : {
              addressData: res,
              client: null,
            },
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getClientListApiData()
        }
      })
    })
  }

  openEmailDialog(id) {
    this.clientEndpoint._GetClient(id).subscribe((res: any) => {
      if (!res.ExtraEmail.length) {
        this.sweetAlertService.successAlert('No Email data！')
      }
      this.dialog.open(EmailManagementDialogComponent, {
        width: '80%',
        height: '80%',
        data: {
          data: res.ExtraEmail,
          customerId: id,
        },
      })
    })
  }

  addressManagement() {
    this.clientEndpoint._GetAllAddress().subscribe((res: any) => {
      if (!res.length) {
        this.sweetAlertService.successAlert('No data！')
      }
      this.dialog.open(AddressManagementDialogComponent, {
        width: '80%',
        data: res,
      })
    })
  }
}
