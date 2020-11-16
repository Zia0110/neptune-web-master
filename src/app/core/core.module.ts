import { NgModule, SkipSelf, Optional } from '@angular/core'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { Title } from '@angular/platform-browser'

import { CommonModule } from '@angular/common'
import { UserState } from './user/user.state'
import { AuthService } from './auth/auth.service'
import { AppConfigStore } from './services/app-config.store'
import { UserEndpoint } from './endpoints/user.endpoint'
import { ErrorResponseInterceptor } from './interceptors/error-response.interceptor'
import { AuthInterceptor } from './interceptors/auth.interceptor'
import { HttpLoadSpinnerInterceptor } from './interceptors/http-load-spinner.interceptor'
import { SweetAlertService } from './alert/sweet-alert.service'
// import { CookieService } from 'ngx-cookie-service'
// import { Cookies } from 'js-cookie'

@NgModule({
  declarations: [],
  imports: [CommonModule, SweetAlert2Module],
  providers: [
    // ChangeDetectorRef,
    // Cookies,
    Title,
    // CookieService,
    // provide: HTTP_INTERCEPTORS,
    UserState,
    AuthService,
    UserEndpoint,
    AppConfigStore,
    SweetAlertService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.')
    }
  }
}
