import { MediaMatcher } from '@angular/cdk/layout'
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router'
import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit, OnInit } from '@angular/core'
import { AppConfigStore } from '../core/services/app-config.store'
import { UserEndpoint } from '../core/endpoints/user.endpoint'

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'admin-layout.component.html',
  styleUrls: [],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList
  dataPrepared = false

  private _mobileQueryListener: () => void

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public appConfigStore: AppConfigStore) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)')
    this._mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addListener(this._mobileQueryListener)
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener)
  }
}
