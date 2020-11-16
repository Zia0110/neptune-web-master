import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component'
import { FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms'
import { CustomValidatorDirective } from '../../shared/directives/custom-validators.directive'
import { Router } from '@angular/router'
import { AuthService } from '../../core/auth/auth.service'
import { UserEndpoint } from '../../core/endpoints/user.endpoint'
import { SweetAlertService } from '../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  errorMessage: string

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private userEndpoint: UserEndpoint,
    private sweetalert: SweetAlertService
  ) {}

  ngOnInit() {
    this.createLoginForm()
  }

  createLoginForm(): FormGroup {
    return (this.loginForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      Password: [
        '',
        [
          Validators.required,
          CustomValidatorDirective.patternValidator(/\d/, { hasNumber: true }),
          CustomValidatorDirective.patternValidator(/[a-z]/, { hasSmallCase: true }),
          Validators.minLength(8),
        ],
      ],
    }))
  }

  login(): void {
    if (!this.loginForm.dirty) {
      this.errorMessage = 'Please fill out the form'
      return
    }
    if (this.loginForm.invalid) {
      this.errorMessage = 'Username or password is invalid'
      // console.log(this.loginForm)
      return
    } else {
      this.loading = true
      this.userEndpoint._userLogin(this.loginForm.value).subscribe(
        (res) => {
          console.log(res), this.authService.setUserAuthInfo(res)
        },
        (err) => {
          console.warn(err), (this.loading = false)
          if (err.error.message.message) {
            this.errorMessage = err.error.message.message
          } else {
            this.errorMessage = 'Sorry, Something has happened.'
          }
        }
      )
    }
  }

  forgetPw() {
    let dialogRef = this.dialog.open(ForgotPasswordComponent, {
      height: '60%',
      width: '50%',
    })
  }
}
