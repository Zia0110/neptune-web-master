import { ChangeDetectorRef, Component, NgZone, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../menu-items';
import { AppConfigStore } from '../../core/services/app-config.store';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})

export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  currentMenuItems:any;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public appConfigState : AppConfigStore,
    public menuItems: MenuItems
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.currentMenuItems = appConfigState.appSettings['Sidebar'].PageGroup
    this.currentMenuItems = menuItems.getMenuitem()
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}