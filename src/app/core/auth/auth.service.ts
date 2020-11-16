import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router'
import { UserEndpoint } from '../endpoints/user.endpoint'
import { CookieService } from 'ngx-cookie-service'
import * as moment from 'moment'
import * as cookies from 'js-cookie'

@Injectable()
export class AuthService {
  constructor(
    public router: Router,
    private userEndpoint: UserEndpoint // public cookieService: CookieService, // private appConfigStore : AppConfigStore,
  ) {}

  // Send and process user login info
  userLogin(userData) {
    console.log(userData)
    this.userEndpoint._userLogin(userData).subscribe((res) => {
      this.setUserAuthInfo(res), console.log(res)
    })
  }

  // Set user authentication info - token and token expires in Cookie
  setUserAuthInfo(data) {
    const x = moment().add(2, 'hours')
    // let x = Date.now() + 44854304
    cookies.set('_token_expire', x)
    cookies.set('_token', data.Token)
    cookies.set('_userId', data.UserId)
    cookies.set('_userName', data.UserName)

    this.pageRedirect()
  }

  // Set user authentication info in Subject

  // Redirect user to apporiate page
  pageRedirect() {
    this.router.navigate(['/admin'])
  }

  // Logout - remove localstorage, unsubscribe to Subject
  logoutCurrentUser() {
    console.warn('log out')
    // Clear sessions & cookies and localstorage
    cookies.remove('_token')
    cookies.remove('_userId')
    cookies.remove('_userName')
    cookies.remove('_token_expire')

    sessionStorage.clear()

    // Unsubscribe to all

    // Redirect last
    this.router.navigate(['/'])
    location.reload()
  }
}
