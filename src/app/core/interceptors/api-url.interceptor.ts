import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
  constructor() {}
  //
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    console.log('Api URL Interceptor')
    console.log(request.url)

    const authToken = 'mytoken'

    const authReq = request.clone({ setHeaders: { Authorization: authToken } })
    return next.handle(authReq)
  }
}
