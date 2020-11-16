import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../../environments/environment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

@Injectable()
export class TransportEndpoint {
  private baseUrl: any = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  userID = this.appConfigStore.userID

  constructor(private http: HttpClient, private appConfigStore: AppConfigStore) {}

  // 新建运输计划
  _newTransportPlan(data) {
    return this.http.post(this.baseUrl + '/api/Transport/CreateTransport/' + this.userID, data)
  }

  _updateInvoiceNo(data) {
    return this.http.put(this.baseUrl + '/api/LogisticsInvoice/UpdateLogisticsInvoiceNo', data)
  }

  _getTransportRequirementsByWarehouse(warehouseID) {
    return this.http.get(this.baseUrl + '/api/Transport/GetTransportRequirementByWarehouseId/' + warehouseID)
  }

  _getTransportPlanByStatus(status) {
    return this.http.get(this.baseUrl + '/api/Transport/GetTransportByStatus?' + status)
  }

  public deleteDeleteTransport(id) {
    return this.http.delete(this.baseUrl + '/api/Transport/DeleteTransport/' + this.userID + '?transportId=' + id)
  }

  _getTransportPlanById(transportId) {
    const transportIds = []
    transportIds.push(transportId)
    return this.http.post(this.baseUrl + '/api/Transport/GetTransportById', transportIds)
  }

  _updateTransportById(data) {
    return this.http.put(this.baseUrl + '/api/Transport/UpdateTransportByTransportId/' + this.userID, data)
  }

  _updateTransportConfirmArrival(data) {
    return this.http.put(this.baseUrl + '/api/Transport/ConfirmTransportArrivedByTransportId/' + this.userID, data)
  }

  _updateTransportInTransit(data) {
    return this.http.put(this.baseUrl + '/api/Transport/UpdateInTransInfo/' + this.userID, data)
  }

  _getTransportRealtimeStock(transportId) {
    return this.http.get(this.baseUrl + '/api/Transport/GetRetailTimeTransportStockById/' + transportId)
  }

  _getTransportLogisticsUnReadDataApi() {
    return this.http.get(this.baseUrl + '/api/LogisticsInvoice/GetUnReadLogisticsInvoice')
  }

  _getTransportLogisticsDataByFilter(queryParams) {
    return this.http.get(this.baseUrl + '/api/LogisticsInvoice/GetLogisticsInvoiceByFilter?' + queryParams)
  }

  _updateTransportLogisticsDataAsRead(data) {
    return this.http.put(this.baseUrl + '/api/LogisticsInvoice/UpdateLogisticsInvoiceRead', data)
  }
}
