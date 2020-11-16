import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router'
import { AppConfigStore } from '../services/app-config.store'

@Injectable({
  providedIn: 'root',
})
export class UserAccessPageGuard implements CanActivate {
  constructor(private router: Router, private appConfigSettings: AppConfigStore) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    let pages = await this.runpages()
    let currentRoute = route['_routerState'].url

    if (currentRoute.includes('admin/client/dashboard')) {
      for (let availablePage of pages) {
        if (availablePage.Url && availablePage.Url.includes('admin/client/dashboard')) {
          return true
        }
      }
    }

    for (let availablePage of pages) {
      if (currentRoute == availablePage.Url) {
        return true
      }
    }

    this.router.navigate(['/'])

    return false
  }

  async runpages() {
    while (!this.appConfigSettings || !this.appConfigSettings.rolePages) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
    return this.appConfigSettings.rolePages
  }
}
