import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core'
import { AdminEndPoint } from '../../../services/endpoints/admin.endpoint'
import { FormControl } from '@angular/forms'
import { CommentDialogComponent } from '../../../../../shared/common-components/comment-dialog/comment-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { MatTabGroup } from '@angular/material/tabs'

@Component({
  selector: 'app-admin-user-access-settings',
  templateUrl: './admin-user-access-settings.component.html',
  styleUrls: ['./admin-user-access-settings.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminUserAccessSettingComponent implements OnInit {
  selected = new FormControl(0)
  roleDatas: any
  allPages: any
  @ViewChild('tabs', { static: false }) tabs: MatTabGroup

  constructor(
    private adminEndpoint: AdminEndPoint,
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getRolesDataApi(), this.getAllPages()
  }

  getRolesDataApi() {
    this.adminEndpoint._getRoles().subscribe((res) => {
      console.log(res)
      this.roleDatas = res
    })
  }

  getAllPages() {
    this.adminEndpoint._getAllPages().subscribe((res) => {
      console.log(res)
      this.allPages = res
    })
  }

  addNewRole() {
    this.dialog
      .open(CommentDialogComponent, {
        width: '35%',
        data: { label: 'New user job title' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.createNewRoleApi({ roleName: res })
      })
  }

  async deleteRole(role) {
    console.log(role)
    if (role.Users.length) {
      return this.sweetAlert.showSweetAlert('Cannot be deleted There are still user posts！')
    } else {
      const deleteConfirm = await this.sweetAlert.saveAlert('Please confirm your deletion, this cannot be undone !')
      if (!deleteConfirm.value) return
      else this.deleteRoleApi(role.RoleId)
    }
  }

  deleteRoleApi(id) {
    this.adminEndpoint._deleteRole(id).subscribe((res) => {
      this.sweetAlert.showSuccessMessage('Successfully deleted')
      this.getRolesDataApi()
    })
  }

  createNewRoleApi(data) {
    this.adminEndpoint._newRole(data).subscribe((res) => {
      this.sweetAlert.showSuccessMessage('Successfully created')
      this.getRolesDataApi()
    })
  }

  rolePageTrigger(check, roleId, pageId, pageMappings?) {
    if (check) {
      this.addRoleWithPage({ roleId: roleId, pageId: pageId })
    } else {
      pageMappings.forEach((element) => {
        if (element.PageId == pageId) {
          return this.roleDeletePage(element.MappingId)
        }
      })
    }
  }

  addRoleWithPage(data) {
    this.adminEndpoint._newRolePage(data).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => {
        const tabSelect = this.selected.value
        this.getRolesDataApi()
        this.tabNavigate(tabSelect)
      }
    )
  }

  roleDeletePage(mappingId) {
    this.adminEndpoint._deleteRolePage(mappingId).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => {
        const tabSelect = this.selected.value
        this.getRolesDataApi()
        this.tabNavigate(tabSelect)
      }
    )
  }

  checkPageMarked(pageUrl, mappings) {
    if (pageUrl) {
      for (let x of mappings) {
        if (x['Url'] == pageUrl) {
          return true
        }
      }
      return false
    }
  }

  tabNavigate(tabSelect) {
    if (!this.tabs || !(this.tabs instanceof MatTabGroup)) return

    this.tabs['_indexToSelect'] = tabSelect
    this.cdr.detectChanges()
  }
}
