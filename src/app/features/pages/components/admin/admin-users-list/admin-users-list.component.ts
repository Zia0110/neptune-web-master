import { Component, OnInit } from '@angular/core'
import { AdminEndPoint } from '../../../services/endpoints/admin.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { MatDialog } from '@angular/material/dialog'
import { AdminUserEditDialogComponent } from '../admin-user-edit-dialog/admin-user-edit-dialog.component'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { CommentDialogComponent } from '../../../../../shared/common-components/comment-dialog/comment-dialog.component'

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.css'],
})
export class AdminUsersListComponent implements OnInit {
  adminUserList: any
  deptList: any
  roleList: any
  data = []
  selected = new FormControl(0)
  viewAllAccounts = false
  departmentList: any
  displayedColumns: string[] = ['username', 'deptname', 'rolename', 'action']

  constructor(
    private appConfigStore: AppConfigStore,
    private adminEndpoint: AdminEndPoint,
    private sweetAlertService: SweetAlertService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getDept()
  }

  // Get Department List
  getDept() {
    this.deptList = []
    this.departmentList = []
    this.adminEndpoint._getDepartment().subscribe((res) => {
      // console.log(res)
      this.deptList = res
      this.departmentList = res
      this.getUser()
      this.getRoles()
    })
  }

  // Get User List
  getUser() {
    this.adminEndpoint._getAdminUsers().subscribe((res) => {
      this.prepData(res)
      this.adminUserList = res
      // console.log('adminUserList: ', this.adminUserList)
    })
  }

  prepData(userDatas) {
    for (let dept of this.departmentList) {
      dept['AppUser'] = []
      dept['CurrentUsers'] = 0
      for (let user of userDatas) {
        if (user.DeptId == dept.DeptId) {
          dept['AppUser'].push(user)
          if (user.IsActive) dept['CurrentUsers']++
        }
      }
    }
  }

  getRoles() {
    this.adminEndpoint._getRoles().subscribe((res) => {
      // console.log(res)
      this.roleList = res
    })
  }

  addNewDept() {
    this.dialog
      .open(CommentDialogComponent, {
        width: '35%',
        data: { label: 'New department name' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.createNewDeptApi({ deptName: res })
      })
  }

  async deleteDept(deptId) {
    const deleteConfirm = await this.sweetAlertService.saveAlert('Confirm delete')
    if (deleteConfirm.value) {
      this.adminEndpoint._deleteDept(deptId).subscribe((success) => {
        this.sweetAlertService.showSuccessMessage('Department successfully deleted')
        this.getDept()
      })
    }
  }

  createNewDeptApi(data) {
    this.adminEndpoint._newDept(data).subscribe((res) => {
      // console.log(res)
      this.sweetAlertService.showSuccessMessage('Successfully created')
      this.getDept()
    })
  }

  disableDeleteDepartment(department) {
    if (department.AppUser.length) {
      for (let user of department.AppUser) {
        if (user.IsActive) {
          return true
        }
      }
    }
    return false
  }

  newAccount() {
    const dialogRef = this.dialog.open(AdminUserEditDialogComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
      data: { deptList: this.deptList, roleList: this.roleList },
    })
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getUser()
      }
    })
  }

  editAccount(user) {
    const dialogRef = this.dialog.open(AdminUserEditDialogComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
      data: { userInfo: user, deptList: this.deptList, roleList: this.roleList },
    })
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getUser()
      }
    })
  }

  resetPasswd(userId) {
    this.adminEndpoint._reset(userId).subscribe((res) => {
      console.log(res)
      this.sweetAlertService.showSuccessMessage('Password reset successfully')
    })
  }

  x(data) {
    console.log(data)
  }

  async deleteAccount(user) {
    console.log(user)
    if (user.UserId == this.appConfigStore.superUser) {
      return this.sweetAlertService.showSweetAlert('Admin user cannot be deleted !')
    }

    const deleteConfirm = await this.sweetAlertService.saveAlert('confirm delete？')
    if (deleteConfirm.value) {
      this.adminEndpoint._deletUser(user.UserId).subscribe((success) => {
        this.sweetAlertService.showSuccessMessage('Account deleted successfully！')
        this.getUser()
      })
    }
  }
}
