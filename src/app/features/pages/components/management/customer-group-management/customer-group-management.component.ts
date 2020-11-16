import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'
import { CustomerGroupNameDialogComponent } from './customer-group-name-dialog/customer-group-name-dialog.component'

@Component({
  selector: 'app-customer-group-management',
  templateUrl: './customer-group-management.component.html',
  styleUrls: ['./customer-group-management.component.css'],
})
export class CustomerGroupManagementComponent implements OnInit {
  selectedType: any
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'name', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  group1Data: any
  group2Data: any
  group3Data: any

  constructor(public dialog: MatDialog, private clientEndpoint: ClientEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.clientEndpoint
      ._GetCustomerGroup1()
      .toPromise()
      .then((res) => (this.group1Data = res))
    this.clientEndpoint
      ._GetCustomerGroup2()
      .toPromise()
      .then((res) => (this.group2Data = res))
    this.clientEndpoint
      ._GetCustomerGroup3()
      .toPromise()
      .then((res) => (this.group3Data = res))
  }

  changeTable(type) {
    switch (type) {
      case 'group1':
        this.selectedType = type
        this.dataSource.data = this.group1Data
        break
      case 'group2':
        this.selectedType = type
        this.dataSource.data = this.group2Data
        break
      case 'group3':
        this.selectedType = type
        this.dataSource.data = this.group3Data
        break
    }
  }

  openItemDialog(element?) {
    const dialogRef = this.dialog.open(CustomerGroupNameDialogComponent, {})
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!element) {
          switch (this.selectedType) {
            case 'group1':
              this.clientEndpoint._NewCustomerGroup1(result).subscribe((_) => {
                this.sweetAlertService.successAlert('Add success! Initial price is 0, you can update price on price management page.')
                this.clientEndpoint
                  ._GetCustomerGroup1()
                  .toPromise()
                  .then((res: any) => (this.dataSource.data = res))
              })
              break
            case 'group2':
              this.clientEndpoint._NewCustomerGroup2(result).subscribe((_) => {
                this.sweetAlertService.successAlert('Add success！')
                this.clientEndpoint
                  ._GetCustomerGroup2()
                  .toPromise()
                  .then((res: any) => (this.dataSource.data = res))
              })
              break
            case 'group3':
              this.clientEndpoint._NewCustomerGroup3(result).subscribe((_) => {
                this.sweetAlertService.successAlert('Add success！')
                this.clientEndpoint
                  ._GetCustomerGroup3()
                  .toPromise()
                  .then((res: any) => (this.dataSource.data = res))
              })
              break
          }
        } else {
          switch (this.selectedType) {
            case 'group1':
              this.clientEndpoint._UpdateCustomerGroup1(element.CutomerGroupId, result).subscribe((_) => {
                this.sweetAlertService.successAlert('Successfully modified ！')
                this.clientEndpoint
                  ._GetCustomerGroup1()
                  .toPromise()
                  .then((res: any) => (this.dataSource.data = res))
              })
              break
            case 'group2':
              this.clientEndpoint._UpdateCustomerGroup2(element.CutomerGroupId, result).subscribe((_) => {
                this.sweetAlertService.successAlert('Successfully modified ！')
                this.clientEndpoint
                  ._GetCustomerGroup2()
                  .toPromise()
                  .then((res: any) => (this.dataSource.data = res))
              })
              break
            case 'group3':
              this.clientEndpoint._UpdateCustomerGroup3(element.CutomerGroupId, result).subscribe((_) => {
                this.sweetAlertService.successAlert('Successfully modified ！')
                this.clientEndpoint
                  ._GetCustomerGroup3()
                  .toPromise()
                  .then((res: any) => (this.dataSource.data = res))
              })
              break
          }
        }
      }
    })
  }

  async deleteItem(id) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    switch (this.selectedType) {
      case 'group1':
        this.clientEndpoint._DeteleCustomerGroup1(id).subscribe((_) => {
          this.sweetAlertService.successAlert('Delete succeeded')
          this.clientEndpoint
            ._GetCustomerGroup1()
            .toPromise()
            .then((res: any) => (this.dataSource.data = res))
        })
        break
      case 'group2':
        this.clientEndpoint._DeteleCustomerGroup2(id).subscribe((_) => {
          this.sweetAlertService.successAlert('Delete succeeded')
          this.clientEndpoint
            ._GetCustomerGroup2()
            .toPromise()
            .then((res: any) => (this.dataSource.data = res))
        })
        break
      case 'group3':
        this.clientEndpoint._DeteleCustomerGroup3(id).subscribe((_) => {
          this.sweetAlertService.successAlert('Delete succeeded')
          this.clientEndpoint
            ._GetCustomerGroup3()
            .toPromise()
            .then((res: any) => (this.dataSource.data = res))
        })
        break
    }
  }
}
