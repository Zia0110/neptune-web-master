import { Component, OnInit } from '@angular/core'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms'
import { UserEndpoint } from '../../../../../core/endpoints/user.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { FinanceOrderDialogComponent } from '../../finance/orders/finance-order-dialog/finance-order-dialog.component'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-user-password-reset-dialog',
  templateUrl: './user-password-reset-dialog.component.html',
  styleUrls: ['./user-password-reset-dialog.component.css'],
})
export class UserPasswordResetDialogComponent implements OnInit {
  data: any
  form: any
  errorMessage: string

  constructor(
    private appConfigSettings: AppConfigStore,
    private formBuilder: FormBuilder,
    private userEndpoint: UserEndpoint,
    public dialogRef: MatDialogRef<FinanceOrderDialogComponent>,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.data = this.appConfigSettings.appSettings
    this.formControlInit()
  }

  formControlInit() {
    this.form = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required, Validators.pattern('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$')]],
        password: ['', [Validators.required, Validators.pattern('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$')]],
        confirmPassword: ['', [Validators.required, Validators.pattern('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$')]],
      },
      {
        validator: this.passwordValidate,
      }
    )
  }

  passwordValidate(group: FormGroup) {
    console.log(group)
    let x1 = group.get('password')
    let x2 = group.get('confirmPassword')
    console.log(x2.value)
    console.log(x1.value)

    return x1 === x2 ? null : { passwordNotEqual: true }
  }

  submitChanges() {
    console.log(this.form)

    if (!this.form.dirty && !this.form.valid) {
      this.errorMessage = '您填的信息有错误！'
      return
    }
    this.errorMessage = null

    let userID = this.appConfigSettings.userID
    let data = this.form.value
    this.userEndpoint._userResetPassword(userID, data).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('Successfully changed！')
      this.dialogRef.close()
    })
  }
}
