import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { AdminEndPoint } from '../../../services/endpoints/admin.endpoint'
import { PageGroupDialogComponent } from './page-group-dialog/page-group-dialog.component'
import { PageManagementDialogComponent } from './page-management-dialog/page-management-dialog.component'

@Component({
  selector: 'app-page-group-management',
  templateUrl: './page-group-management.component.html',
  styleUrls: ['./page-group-management.component.css'],
})
export class PageGroupManagementComponent implements OnInit {
  displayedColumns: string[] = ['position', 'GroupName', 'Ordering', 'Icon', 'handle']
  dataSource = new MatTableDataSource()

  constructor(public dialog: MatDialog, private adminEndpoint: AdminEndPoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData() {
    this.adminEndpoint
      ._getAllPageGroup()
      .toPromise()
      .then((res: any) => {
        this.dataSource.data = res
      })
  }

  openPageManagement(element) {
    this.dialog.open(PageManagementDialogComponent, {
      width: '100%',
      height: '97%',
      data: element,
    })
  }

  openItemDialog(element?) {
    const dialogRef = this.dialog.open(PageGroupDialogComponent, {
      autoFocus: false,
      data: element ? element : '',
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!element) {
          this.adminEndpoint
            ._newPageGroup({
              Icon: result.Icon,
              GroupName: result.GroupName,
              Ordering: result.Ordering,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Add succeeded!')
              this.getAllData()
            })
        } else {
          this.adminEndpoint
            ._updatePageGroup(element.GroupId, {
              GroupId: element.GroupId,
              Icon: result.Icon,
              GroupName: result.GroupName,
              Ordering: result.Ordering,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Modified succeeded！')
              this.getAllData()
            })
        }
      }
    })
  }

  async deleteItem(id) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.adminEndpoint._deletePageGroup(id).subscribe((_) => {
      this.sweetAlertService.successAlert('Delete succeeded')
      this.getAllData()
    })
  }
}
