import { Component, Inject, OnInit, Optional } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { AdminEndPoint } from '../../../../services/endpoints/admin.endpoint'
import { PageManagementItemDialogComponent } from './page-management-item-dialog/page-management-item-dialog.component'

@Component({
  selector: 'app-page-management-dialog',
  templateUrl: './page-management-dialog.component.html',
  styleUrls: ['./page-management-dialog.component.css'],
})
export class PageManagementDialogComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'url', 'ordering', 'icon', 'handle']
  dataSource = new MatTableDataSource()

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    public dialog: MatDialog,
    private adminEndpoint: AdminEndPoint
  ) {}

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData() {
    this.adminEndpoint
      ._getAllPageGroup()
      .toPromise()
      .then((res: any) => {
        this.dataSource.data = res.filter((item) => item.GroupId === this.data.GroupId)[0].Pages
      })
  }

  openItemDialog(element?) {
    const dialogRef = this.dialog.open(PageManagementItemDialogComponent, {
      autoFocus: false,
      data: element ? element : '',
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!element) {
          this.adminEndpoint
            ._newPage({
              Icon: result.Icon,
              PageName: result.PageName,
              Url: result.Url,
              Ordering: result.Ordering,
              GroupId: this.data.GroupId,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Add succeeded!')
              this.getAllData()
            })
        } else {
          this.adminEndpoint
            ._updatePage(element.PageId, {
              PageId: element.PageId,
              Icon: result.Icon,
              PageName: result.PageName,
              Url: result.Url,
              Ordering: result.Ordering,
              GroupId: this.data.GroupId,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Modified succeeded！')
              this.getAllData()
            })
        }
      }
    })
  }
}
