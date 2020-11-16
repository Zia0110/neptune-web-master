import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
// import { CookieService } from 'ngx-cookie-service'
import * as cookies from 'js-cookie'
import * as moment from 'moment'
import { UserEndpoint } from '../endpoints/user.endpoint'

@Injectable()

// This interceptor adds api token to all requests (if there is an token)
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userEndpoint: UserEndpoint // private cookieService: CookieService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const time = moment().add(20, 'minutes')
    if (cookies.get('_token')) {
      if (time.isAfter(cookies.get('_token_expire'))) {
        setTimeout(() => {
          this.userEndpoint
            ._getNewToken(cookies.get('_userId'))
            .toPromise()
            .then((data: any) => {
              const x = moment().add(2, 'hours')
              // let x = Date.now() + 44854304
              cookies.set('_token_expire', x)
              cookies.set('_token', data.Token)
              cookies.set('_userId', data.UserId)
              cookies.set('_userName', data.UserName)
            })
        }, 2000)
      }
    }
    // We retrieve the token, if any
    const token = cookies.get('_token')
    let newHeaders = req.headers

    // If we have a token, we will add it to our headers
    if (token) {
      newHeaders = newHeaders.append('Authorization', 'bearer ' + token)
    }

    const authReq = req.clone({ headers: newHeaders })

    return next.handle(authReq)
  }
}
