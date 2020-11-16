import { AfterViewInit, Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../core/alert/sweet-alert.service'
import { UserEndpoint } from '../../../../core/endpoints/user.endpoint'
import { AppConfigStore } from '../../../../core/services/app-config.store'
import { UserState } from '../../../../core/user/user.state'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  // this "config" is for testing purposes. Production version will require interface

  constructor(
    private appConfigStore: AppConfigStore,
    private userState: UserState,
    private userEndpoint: UserEndpoint,
    private sweetAlertService: SweetAlertService
  ) {}

  ngAfterViewInit() {}

  public showSearchContents(): void {
    const currentSearchContent = this.userState.currentQueryParams.getValue()
    console.log('Dashboard: ', currentSearchContent)
    console.log('Dashboard URL: ', this.userState.currentRouteURL.getValue())
  }
}
