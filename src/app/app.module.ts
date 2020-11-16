import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { LocationStrategy, PathLocationStrategy } from '@angular/common'
import { AppRoutesModule } from './app.routing'
import { AppComponent } from './app.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CoreModule } from './core/core.module'
import { ViewsModule } from './views/views.module'
import { LayoutModule } from './layouts/layouts.module'
import { DemoMaterialModule } from './styles/demo-material-module'
import { NgxSpinnerModule } from 'ngx-spinner'
import { HttpLoadSpinnerInterceptor } from './core/interceptors/http-load-spinner.interceptor'
// import { CookieService } from 'ngx-cookie-service'
import { HashLocationStrategy } from '@angular/common'

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DemoMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    // Core Modules
    LayoutModule,
    ViewsModule,
    CoreModule,

    AppRoutesModule,

    // ElModule.forRoot(),
    // RouterModule.forRoot(AppRoutesModule, { enableTracing: true })
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [
    // CookieService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadSpinnerInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
