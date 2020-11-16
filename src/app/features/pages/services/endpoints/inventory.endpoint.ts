import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { environment } from '../../../../../environments/environment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

@Injectable()
export class InventoryEndpoint {
  baseUrl = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  userID = this.appConfigStore.userID
  public currentStockId = new BehaviorSubject('')

  constructor(private http: HttpClient, private appConfigStore: AppConfigStore) {}

  public getCustomersList() {
    return this.http.get(this.baseUrl + '/api/customer/getstockcustomer')
  }

  public GetOrderNosByType(baseProductId, customerId, type) {
    return this.http.get(this.baseUrl + '/api/Stock/GetOrderNosByType/' + baseProductId + '/' + customerId + '/' + type)
  }

  public getStockByCustomerId(customerId: number) {
    return this.http.get(this.gzipBaseUrl + '/api/stock/getstockbycustomerid/' + customerId)
  }

  public getStockHistory(curStockId: string) {
    return this.http.get(this.baseUrl + '/api/stock/GetStockHistoriesByStockId/' + curStockId)
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  public getStockHistoryInfo(curStockId: string, beginDate?: string, endDate?: string) {
    const now = new Date()
    const currentDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const last30days = new Date(now.setDate(now.getDate() - 30))
    const startDateString = `${last30days.getFullYear()}-${last30days.getMonth() + 1}-${last30days.getDate()}`
    return beginDate && endDate
      ? this.http.get(
          this.baseUrl +
            '/api/stock/GetStockHistoryInfoByStockId/' +
            curStockId +
            '?beginDate=' +
            this.getUTCdate(beginDate) +
            '&endDate=' +
            this.getUTCdate(endDate)
        )
      : this.http.get(
          this.baseUrl +
            '/api/stock/GetStockHistoryInfoByStockId/' +
            curStockId +
            '?beginDate=' +
            this.getUTCdate(startDateString) +
            '&endDate=' +
            this.getUTCdate(currentDateString)
        )
  }

  public GetOverallStockLogsByCustomerId(customerId: number, beginDate?: string, endDate?: string) {
    const now = new Date()
    const currentDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const last180days = new Date(now.setDate(now.getDate() - 180))
    const startDateString = `${last180days.getFullYear()}-${last180days.getMonth() + 1}-${last180days.getDate()}`
    return beginDate && endDate
      ? this.http.get(
          this.gzipBaseUrl +
            '/api/OverallStock/GetOverallStockLogsByCustomerId/' +
            customerId +
            '?beginDate=' +
            this.getUTCdate(beginDate) +
            '&endDate=' +
            this.getUTCdate(endDate)
        )
      : this.http.get(
          this.gzipBaseUrl +
            '/api/OverallStock/GetOverallStockLogsByCustomerId/' +
            customerId +
            '?beginDate=' +
            this.getUTCdate(startDateString) +
            '&endDate=' +
            this.getUTCdate(currentDateString)
        )
  }

  public GetPurchaseOrderByOrderNo(data) {
    // if (data.length) {
    //   let url = this.baseUrl + '/api/PurchaseOrder/GetPurchaseOrderByOrderNo?orderNos=' + data[0]
    //   data.map((orderNo, index) => (url += index >= 1 ? `&orderNos=${orderNo}` : ''))
    const url = this.baseUrl + '/api/PurchaseOrder/GetPurchaseOrderByOrderNo'
    return this.http.post(url, data)
    // }
  }

  public GetTransferApplicationByApplicationId(data) {
    if (data.length) {
      const url = this.baseUrl + '/api/Transfer/StockGetTransferApplicationWithTransport'
      // data.map((applicationId, index) => (url += index >= 1 ? `&applicationId=${applicationId}` : ''))
      return this.http.post(url, data)
    }
  }

  public GetTransportById(data) {
    if (data.length) {
      const url = this.baseUrl + '/api/Transport/GetTransportById'
      // data.map((id, index) => (url += index >= 1 ? `&transportId=${id}` : ''))
      return this.http.post(url, data)
    }
  }

  public GetLostEventByPropertyId(data) {
    if (data.length) {
      const url = this.baseUrl + '/api/LostEvent/GetLostEventByPropertyId'
      // data.map((id, index) => (url += index >= 1 ? `&propertyId=${id}` : ''))
      return this.http.post(url, data)
    }
  }

  public GetWholeSaleOrderWithTransport(data) {
    if (data.length) {
      const url = this.baseUrl + '/api/StockWholeSaleOrder/GetWholeSaleOrderWithTransport'
      // data.map((id, index) => (url += index >= 1 ? `&wholeSaleOrderId=${id}` : ''))
      return this.http.post(url, data)
    }
  }

  public GetSelfGoodsByIds(data) {
    // if (data.length) {
    //   let url = this.baseUrl + '/api/SelfGood/GetSelfGoodsByIds?selfGoodsId=' + data[0]
    //   data.map((id, index) => (url += index >= 1 ? `&selfGoodsId=${id}` : ''))
    const url = this.baseUrl + '/api/SelfGood/GetSelfGoodsByIds'
    return this.http.post(url, data)
    // }
  }

  public getTransferDataByProductIdAndOutCustomerId(BaseProductId, outCustomerId) {
    const productIdPara = 'baseProductId='
    const outCustomerPara = 'fromCustomerId='
    const paraForAPI = productIdPara + BaseProductId + '&' + outCustomerPara + outCustomerId
    return this.http.get(this.baseUrl + '/api/Transfer/GetWarehouseAndTransport?' + paraForAPI)
  }

  public getTransferApplication(startDate, endDate) {
    const paraForAPI = 'beginDate=' + this.getUTCdate(startDate) + '&endDate=' + this.getUTCdate(endDate)
    return this.http.get(this.baseUrl + '/api/Transfer/GetTransferApplication?' + paraForAPI)
  }

  public updateTransferApplication(objectToPost) {
    return this.http.put(this.baseUrl + '/api/Transfer/InfiniteUpdateTransferApplication', objectToPost)
  }

  public GetCustomerStocks(customerId, productId) {
    return this.http.get(this.baseUrl + '/api/Customer/GetCustomerStocks?customerId=' + customerId + '&baseProductId=' + productId)
  }

  public GetStockByProductAndCustomerId(baseProductId, customerId) {
    return this.http.get(this.baseUrl + '/api/Stock/GetStockByProductAndCustomerId?baseProductId' + baseProductId + '&customerId=' + customerId)
  }

  public GetStockByBaseProductId(baseProductId) {
    return this.http.get(this.baseUrl + '/api/Stock/GetStockByBaseProductId/' + baseProductId)
  }

  public getClientInventorySelfPurchaseDatas(queryParams) {
    return this.http.get(this.baseUrl + '/api/SelfGood/GetSelfGoodsByFilter?' + queryParams)
  }
  public createNewClientInventorySelfPurchaseData(data) {
    return this.http.post(this.baseUrl + '/api/SelfGood/CreateSelfGoods/' + this.userID, data)
  }

  public deleteSelfBuy(selfGoodId) {
    return this.http.delete(this.baseUrl + '/api/SelfGood/DeleteSelfGoods/' + this.userID + '?selfGoodId=' + selfGoodId)
  }

  public deleteTransferApplication(id) {
    return this.http.delete(this.baseUrl + '/api/Transfer/DeleteTransferApplication/' + this.userID + '?applicationId=' + id)
  }

  public getInventorySnapshot(customerId, queryDate) {
    return this.http.get(this.baseUrl + '/api/Stock/GetInventorySnapshot/' + customerId + '/' + queryDate)
  }
}
