import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { finalize } from 'rxjs/operators'
import { NgxSpinnerService } from 'ngx-spinner'
import { preventSpinnerUrls } from './prevent-spinner-urls'
@Injectable()

// This interceptor shows the spinner whenever theres an http request
export class HttpLoadSpinnerInterceptor implements HttpInterceptor {
  count = 0

  constructor(
    // private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const filteredArray = preventSpinnerUrls.filter((url) => req.url.indexOf(url) !== -1)
    this.count++
    // console.log(filteredArray)
    if (!filteredArray.length) {
      // console.log('spinner start')
      setTimeout(() => {
        this.spinner.show()
      }, 20)
      // console.log('spinner ends')
    }

    // this.spinner.show()
    // this.count++;
    return next.handle(req).pipe(
      finalize(() => {
        this.count--
        if (this.count == 0) this.spinner.hide()

        // console.log({'Api called' : req})
        // this.count--;
        // if (this.count == 0)
        // this.spinner.hide()
        // this.cdr.detectChanges()
      })
    )
  }
}
