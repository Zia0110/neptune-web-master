import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import * as cookies from 'js-cookie'
import * as moment from 'moment'
import { AuthService } from '../auth/auth.service'

@Injectable({
  providedIn: 'root',
})
export class UserIsAdminGuard implements CanActivate {
  constructor(private router: Router, private authservice: AuthService) {}
  canActivate(): boolean {
    console.log(cookies.get('_token_expire'))
    // const time = Date.now()
    const time = moment()
    if (cookies.get('_token')) {
      if (time.isBefore(cookies.get('_token_expire'))) {
        return true
      } else {
        this.authservice.logoutCurrentUser()
      }
    }
    this.router.navigate(['/'])
    return false
  }
}
