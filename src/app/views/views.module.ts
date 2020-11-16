import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    // SpinnerComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // SpinnerComponent,
  ],

})

export class ViewsModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ViewsModule
  ) {
    if (parentModule) {
      throw new Error(
        'Views Module is already imported. Import it in the AppModule only.'
      );
    }
  }
}
