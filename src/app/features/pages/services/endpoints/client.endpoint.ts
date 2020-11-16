import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { environment } from '../../../../../environments/environment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

@Injectable()
export class ClientEndpoint {
  baseUrl = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  userID = this.appConfigStore.userID

  constructor(private http: HttpClient, private appConfigStore: AppConfigStore) {}

  _getClientsList() {
    return this.http.get(this.gzipBaseUrl + '/api/Customer')
  }

  _addClient(data) {
    return this.http.post(this.baseUrl + '/api/Customer', data)
  }

  _updateClient(id, data) {
    return this.http.put(this.baseUrl + '/api/Customer/' + id, data)
  }

  _getClientDashboardViewDetail(clientId, queryParams) {
    return this.http.get(this.gzipBaseUrl + '/api/Customer/GetCustomerProductStatistics/' + clientId + '?' + queryParams)
  }

  _getClientsStats(queryParams) {
    return this.http.get(this.gzipBaseUrl + '/api/Customer/GetCustomerDateStatistics/?' + queryParams)
  }

  _GetClientNameMapping() {
    return this.http.get(this.baseUrl + '/api/CustomerNameMapping')
  }

  _PostNewClientNameMapping(data) {
    return this.http.post(this.baseUrl + '/api/CustomerNameMapping', data)
  }

  _PutModifyClientNameMapping(id, data) {
    return this.http.put(this.baseUrl + '/api/CustomerNameMapping/' + id, data)
  }

  _DeleteClientNameMapping(id) {
    return this.http.delete(this.baseUrl + '/api/CustomerNameMapping/' + id)
  }

  _GetClient(id) {
    return this.http.get(this.baseUrl + '/api/Customer/' + id)
  }

  _CreateClientEmail(customerId, email) {
    return this.http.post(this.baseUrl + '/api/Customer/CreateEmailByCustomerId/' + customerId + '?email=' + email, null)
  }

  _UpdateClientEmail(emailId, email) {
    return this.http.put(this.baseUrl + '/api/Customer/UpdateEmailByEmailId/' + emailId + '?email=' + email, null)
  }

  _DeleteClientEmail(emailId) {
    return this.http.delete(this.baseUrl + '/api/Customer/DeleteEmailByEmailId/' + emailId)
  }

  _GetAllAddress() {
    return this.http.get(this.baseUrl + '/api/Address')
  }

  _GetAddressByAddrId(addressId) {
    return this.http.get(this.baseUrl + '/api/Address/' + addressId)
  }

  _CreateAddress(data) {
    return this.http.post(this.baseUrl + '/api/Address', data)
  }

  _UpdateAddress(addressId, data) {
    return this.http.put(this.baseUrl + '/api/Address/' + addressId, data)
  }

  _DeleteAddress(addressId) {
    return this.http.delete(this.baseUrl + '/api/Address/' + addressId)
  }

  _ImageUpload(imageData) {
    return this.http.post(this.baseUrl + '/api/Common/UploadImage', imageData)
  }

  _GetCustomerGroup1() {
    return this.http.get(this.baseUrl + '/api/CustomerGroup/GetAllCustomerGroup1')
  }

  _NewCustomerGroup1(data) {
    return this.http.post(this.baseUrl + '/api/CustomerGroup/CreateCustomerGroup1', {
      customerGroupName: data,
    })
  }

  _UpdateCustomerGroup1(id, data) {
    return this.http.put(this.baseUrl + '/api/CustomerGroup/UpdateCustomerGroup1/' + id, {
      customerGroupName: data,
    })
  }

  _DeteleCustomerGroup1(id) {
    return this.http.delete(this.baseUrl + '/api/CustomerGroup/DeleteCustomerGroup1/' + id)
  }

  _GetCustomerGroup2() {
    return this.http.get(this.baseUrl + '/api/CustomerGroup/GetAllCustomerGroup2')
  }

  _NewCustomerGroup2(data) {
    return this.http.post(this.baseUrl + '/api/CustomerGroup/CreateCustomerGroup2', {
      customerGroupName: data,
    })
  }

  _UpdateCustomerGroup2(id, data) {
    return this.http.put(this.baseUrl + '/api/CustomerGroup/UpdateCustomerGroup2/' + id, {
      customerGroupName: data,
    })
  }

  _DeteleCustomerGroup2(id) {
    return this.http.delete(this.baseUrl + '/api/CustomerGroup/DeleteCustomerGroup2/' + id)
  }

  _GetCustomerGroup3() {
    return this.http.get(this.baseUrl + '/api/CustomerGroup/GetAllCustomerGroup3')
  }

  _NewCustomerGroup3(data) {
    return this.http.post(this.baseUrl + '/api/CustomerGroup/CreateCustomerGroup3', {
      customerGroupName: data,
    })
  }

  _UpdateCustomerGroup3(id, data) {
    return this.http.put(this.baseUrl + '/api/CustomerGroup/UpdateCustomerGroup3/' + id, {
      customerGroupName: data,
    })
  }

  _DeteleCustomerGroup3(id) {
    return this.http.delete(this.baseUrl + '/api/CustomerGroup/DeleteCustomerGroup3/' + id)
  }

  _getAllStockCustomerMapping() {
    return this.http.get(this.baseUrl + '/api/StockCustomerMapping')
  }

  _newStockCustomerMapping(data) {
    return this.http.post(this.baseUrl + '/api/StockCustomerMapping', data)
  }

  _updateStockCustomerMapping(id, data) {
    return this.http.put(this.baseUrl + '/api/StockCustomerMapping/' + id, data)
  }

  _deleteStockCustomerMapping(id) {
    return this.http.delete(this.baseUrl + '/api/StockCustomerMapping/' + id)
  }
}
