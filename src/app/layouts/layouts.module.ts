import { NgModule, Optional, SkipSelf } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FlexLayoutModule } from '@angular/flex-layout'

import { SharedModule } from '../shared/shared.module'

import { AdminLayoutComponent } from './admin-layout.component'
import { AppHeaderComponent } from './header/header.component'
import { AppSidebarComponent } from './sidebar/sidebar.component'
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component'
import { ErrorLogComponent } from './error-log/error-log.component'
import { MenuItems } from './menu-items'
// import { NgxSpinnerModule } from 'ngx-spinner'

@NgModule({
  declarations: [AdminLayoutComponent, AppHeaderComponent, AppSidebarComponent, BreadcrumbsComponent, ErrorLogComponent],
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    FlexLayoutModule,
    // NgxSpinnerModule
  ],
  exports: [],
  providers: [MenuItems],
})
export class LayoutModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: LayoutModule
  ) {
    if (parentModule) {
      throw new Error('LayoutsModule is already loaded. Import it in the AppModule only.')
    }
  }
}
