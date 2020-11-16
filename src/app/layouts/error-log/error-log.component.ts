import { MediaMatcher } from '@angular/cdk/layout'
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router'
import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit, OnInit } from '@angular/core'
import { UserState } from '../../core/user/user.state'

/** @title Responsive sidenav */
@Component({
  selector: 'app-error-log',
  templateUrl: 'error-log.component.html',
  styleUrls: [],
})
export class ErrorLogComponent implements OnDestroy {
  currentError: any

  constructor(private userState: UserState) {
    this.errorLogSub()
  }

  errorLogSub() {
    this.userState.errorLog.subscribe((res) => {
      console.log(res), (this.currentError = res)
    })
  }

  ngOnDestroy(): void {}
}

/*
normal

headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
  status: 400
  statusText: "Bad Request"
  url: "http://45.76.123.59:5050/api/dept/3fa85f64"
  ok: false
  name: "HttpErrorResponse"
  message: "Http failure response for http://45.76.123.59:5050/api/dept/3fa85f64: 400 Bad Request"
  error:
    errors: {deptId: Array(1)}
    type: "https://tools.ietf.org/html/rfc7231#section-6.5.1"
    title: "One or more validation errors occurred."
    status: 400
    traceId: "|3d547c9b-4f9ead7120a4505f."


not normal

status: 404
statusText: "Not Found"
url: "http://45.76.123.59:5050/dept"
ok: false
name: "HttpErrorResponse"

message: "Http failure response for http://45.76.123.59:5050/dept: 404 Not Found"

error: null

3. time out










*/
