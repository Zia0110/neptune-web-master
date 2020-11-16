import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { AdminEndPoint } from '../../../services/endpoints/admin.endpoint'

@Component({
  selector: 'app-admin-user-edit-dialog',
  templateUrl: './admin-user-edit-dialog.component.html',
  styleUrls: ['./admin-user-edit-dialog.component.css'],
})
export class AdminUserEditDialogComponent implements OnInit {
  errorMessage: string
  dialogTitle: string
  newPassword = new FormControl()
  form: FormGroup
  constructor(
    public dialogRef: MatDialogRef<AdminUserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private adminEndpoint: AdminEndPoint,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    console.log(this.data)
    this.formControlInit()
    if (!this.data.userInfo) {
      this.dialogTitle = 'New user'
    } else {
      this.dialogTitle = 'Modify user'
    }
  }

  formControlInit() {
    this.form = this.formBuilder.group(
      {
        userName: ['', [Validators.required]],
        // password: ['', [Validators.required]],
        deptId: ['', [Validators.required]],
        roleId: ['', [Validators.required]],
      },
      {}
    )
    if (this.data.userInfo) {
      this.setUserData(this.data.userInfo)
    } else {
      this.newPassword.patchValue(Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8))
    }
  }

  setUserData(data) {
    this.form.controls.userName.patchValue(data.UserName)
    this.form.controls.deptId.patchValue(data.DeptId)
    this.form.controls.roleId.patchValue(data.RoleId)
  }

  saveChanges() {
    if (!this.form.valid || !this.form.dirty) {
      return (this.errorMessage = 'Information is incorrect！')
    }

    if (!this.data.userInfo) {
      let userData = this.form.value
      userData['isActive'] = true
      userData['password'] = this.newPassword.value
      this.createNewUserApi(userData)
    } else {
      let updateData = this.form.value
      updateData['IsActive'] = true
      this.updateUserApi(updateData, this.data.userInfo.UserId)
    }
  }

  createNewUserApi(data) {
    this.adminEndpoint._newAdminAccount(data).subscribe((res) => {
      this.sweetAlert.showSuccessMessage('Create success！')
      console.log(res)
      this.dialogRef.close('success')
    })
  }

  updateUserApi(data, userID) {
    this.adminEndpoint._updateAdminAccount(data, userID).subscribe((res) => {
      this.sweetAlert.showSuccessMessage('Modify success！')
      console.log(res)
      this.dialogRef.close('success')
    })
  }
}
