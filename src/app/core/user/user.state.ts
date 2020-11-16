import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router'
import { Title } from '@angular/platform-browser'

@Injectable()
export class UserState {
  routeParams: any

  // Current URL Route Subject
  currentRouteURL = new BehaviorSubject({})

  // Current search params in Route
  currentQueryParams = new BehaviorSubject(null)

  // User error log subject
  errorLog = new Subject()

  //  Loading spinner conditions
  currentHttpLoadSpinner = false

  baseUrl: string = 'localhost:4200/'

  paramsHold = {}

  constructor(public route: Router, private titleService: Title) {
    this.userRouterStateHandler()
  }

  userRouterStateHandler() {
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route)
      )
      .subscribe((event) => {
        this.currentRouteURL.next(this.route.routerState.snapshot.url)
        this.titleHandler(this.route.routerState)
      })
  }

  titleHandler(route) {
    const title = this.getTitle(route, route.root).join(' | ')
    this.titleService.setTitle('DAL | ' + title)
  }

  getTitle(state, parent) {
    const data = []
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title)
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)))
    }
    return data
  }

  // Update router search params (after ? )
  _routerSearchParamUpdate(param) {}

  // Pushes search params updates to subject

  public updateSearchParameterAndUrl(searchContent): void {
    this.currentQueryParams.next(searchContent)
    let paras = searchContent.split(' ').join('/')
    let newUrl = this.baseUrl + paras
    this.currentRouteURL.next(newUrl)
  }
}
