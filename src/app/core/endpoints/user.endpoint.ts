import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable()
export class UserEndpoint {
  private baseUrl: any = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl

  constructor(private http: HttpClient) {}

  _userLogin(data) {
    return this.http.post(this.baseUrl + '/api/User/Login', data)
  }

  _getNewToken(id) {
    return this.http.get(this.baseUrl + '/api/User/RefreshToken/' + id)
  }

  _userDataPrep(userID) {
    return this.http.get(this.gzipBaseUrl + '/api/user/GetPageWhenLogin?userId=' + userID)
  }

  public getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.gzipBaseUrl + '/api/product')
  }
  _getWarehousesList() {
    return this.http.get(this.baseUrl + '/api/warehouse')
  }
  _getProductsList() {
    return this.http.get(this.gzipBaseUrl + '/api/Product/GetAllDisplayProduct')
  }
  _getClientsList() {
    return this.http.get(this.gzipBaseUrl + '/api/Customer')
  }

  _userResetPassword(userID, data) {
    return this.http.put(this.baseUrl + '/api/User/ResetPassword/' + userID, data)
  }
}
