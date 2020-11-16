import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/operator/do'
import { SweetAlertService } from '../alert/sweet-alert.service'
import { UserState } from '../user/user.state'
import { AuthService } from '../auth/auth.service'

@Injectable()

// This interceptor handles all error responses and pushes these responses to user state
export class ErrorResponseInterceptor implements HttpInterceptor {
  constructor(private userState: UserState, private sweetAlertService: SweetAlertService, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do(
      (event: HttpEvent<any>) => {
        // do nothing
      },
      (err: any) => {
        // Error handling here
        console.warn(err)
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authService.logoutCurrentUser()
            return
          }
          if (err.error) {
            console.log(err)
            if (err.error.htmlMessage) {
              this.sweetAlertService.showSweetAlert2(err.error.htmlMessage, err.error.innerMessage, true)
              return
            }
            if (err.error.errors) {
              // if ( err.error.message ){title
              //   this.userState.errorLog.next(err.error);title
              // }
              this.userState.errorLog.next(err.error.title)
              this.sweetAlertService.showSweetAlert2(err.error.title, JSON.stringify(err.error.errors))
            } else if (err.error.message) {
              // if ( err.error.message ){
              //   this.userState.errorLog.next(err.error);
              // }
              this.userState.errorLog.next(err.error.message.message)
              this.sweetAlertService.showSweetAlert2(err.error.message.message, err.error.innerMessage)
              // this.sweetAlertService.showSweetAlert();
            } else {
              // if ( err.error.message ){
              //   this.userState.errorLog.next(err.error);
              // }
              this.userState.errorLog.next(err.message)
              this.sweetAlertService.showSweetAlert2(err.name + ':' + err.statusText, err.message)
              // this.sweetAlertService.showSweetAlert();
            }
          } else {
            // If error is not formated, then map error in accordance to errorMessage interface
            this.userState.errorLog.next(err['message'])
            this.sweetAlertService.showSweetAlert2(err.name + ',' + err.status + ',' + err.statusText, err.message)
          }
        }
      }
    )
  }
}
