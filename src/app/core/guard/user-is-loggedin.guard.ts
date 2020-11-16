import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import * as cookies from 'js-cookie'
import * as moment from 'moment'
import { AuthService } from '../auth/auth.service'

@Injectable({
  providedIn: 'root',
})
export class UserIsLoggedInGuard implements CanActivate {
  constructor(private router: Router, private authservice: AuthService) {}
  canActivate(): boolean {
    // const time = Date.now()
    const time = moment()

    if (cookies.get('_token')) {
      if (time.isBefore(cookies.get('_token_expire'))) {
        this.router.navigate(['/admin'])
        return
      } else {
        this.authservice.logoutCurrentUser()
      }
    }
    return true
  }
}
