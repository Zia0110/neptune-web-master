import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../../../environments/environment'
import { AppConfigStore } from '../../../../core/services/app-config.store'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class OrderEndpoint {
  private baseUrl: any = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  userID = this.appConfigStore.userID

  // this is used to store the return urls(images), and then used in the create new ticket
  public returnImagesUrls = new BehaviorSubject(null)

  constructor(private http: HttpClient, private appConfigStore: AppConfigStore) {}

  // 退单更新
  _updateOrderReturnStatus(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/ChargeBackRetailOrder/' + this.userID, data)
  }

  _updateBatchesOrdersReturnStatus(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/BatchChargeBackRetailOrder/' + this.userID, data)
  }

  _getOrdersConsumerByStatus(status) {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByStatus?status=' + status)
  }

  _ReGetRetailOrderMappingInfo(data) {
    return this.http.post(this.baseUrl + '/api/retailOrder/ReGetRetailOrderMappingInfo', data)
  }

  _ordersConsumerImport(data) {
    return this.http.post(this.baseUrl + '/api/RetailOrder/' + this.userID, data)
  }

  _BatchUpdateRetailOrderByOrderNos(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/BatchUpdateRetailOrderByOrderNos/' + this.userID, data)
  }

  _ordersConsumerImportSearch(searchParams) {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByBatchDate/' + searchParams)
  }

  _orderBatchUpdate(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/BatchUpdateRetailOrderByOrderNos/' + this.userID, data)
  }

  _ordersConsumerList() {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderMappingInfo')
  }

  _orderSearchByOrderArray(orderNos) {
    return this.http.post(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByOrderNos/', orderNos)
  }

  _orderSearchByOrderNo(orderNo) {
    return this.http.get(this.baseUrl + '/api/RetailOrder/GetRetailOrderByOrderNo/' + orderNo)
  }

  _orderSearchByOrderId(orderId) {
    return this.http.get(this.baseUrl + '/api/RetailOrder/GetRetailOrderByOrderId/' + orderId)
  }

  _orderSearchByFinanceRange(qp) {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByBillingDate?' + qp)
  }

  _orderUpdateByOrderNo(orderNo, data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/UpdateRetailOrderByOrderNo/' + orderNo, data)
  }

  _imageUpload(data) {
    return this.http.post(this.baseUrl + '/api/Common/UploadImage', data)
  }

  _orderImageUpload(data) {
    return this.http.post(this.baseUrl + '/api/OrderImage/CreateOrderImage', data)
  }

  _orderImageDelete(imageId) {
    return this.http.delete(this.baseUrl + '/api/OrderImage/' + imageId)
  }

  _ordersConsumerListPostProduct(data) {
    return this.http.post(this.baseUrl + '/api/ProductNameMapping', data)
  }

  _ordersConsumerListPostCustomer(data) {
    return this.http.post(this.baseUrl + '/api/CustomerNameMapping', data)
  }

  _ordersConsumerListPutNormalisation(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/UpdateRetailOrderMappingNormalization/' + this.userID, data)
  }

  _inventoryInquiryWholeSaleOrderDetail() {
    return this.http.get(this.baseUrl + '/api/StockWholeSaleOrder/GetPaidWholeSaleOrderDetail')
  }

  _getOutStockBatchByDate(queryParams) {
    return this.http.get(this.gzipBaseUrl + '/api/StockRetailOrder/GetOutStockBatchByDate?' + queryParams)
  }

  _getOutStockOrdersByBatch(queryParams) {
    return this.http.get(this.gzipBaseUrl + '/api/StockRetailOrder/GetRetailOrderByOutStockBatchId?' + queryParams)
  }

  _getOrdersByCin7ImportNo(invoiceNo) {
    return this.http.get(this.baseUrl + '/api/ImportCin7Invoice/GetRetailOrderByCin7InvoiceNo/' + invoiceNo)
  }

  //待处理问题单 all the tickets under all order numbers
  _orderTicketList() {
    return this.http.get(this.baseUrl + '/api/Ticket/GetAllTickets')
  }

  //创建 新的Ticket Process
  _createTicketProcess(userId: string, tickedId: string, content: string) {
    let resultJson: any = {
      ticketId: tickedId,
      content: content,
    }
    return this.http.post(this.baseUrl + '/api/Ticket/CreateNewTicketProcessByTicketId/' + userId, resultJson)
  }

  //finish the ticket
  _updateTicketCompleteByTicketId(ticketId) {
    console.log(ticketId)
    //have to be + ticketId with --- '' ---
    return this.http.put(this.baseUrl + '/api/Ticket/UpdateTicketCompleteByTicketId/' + ticketId, '')
  }

  //创建 新的Ticket
  _createTicket(data) {
    return this.http.post(this.baseUrl + '/api/Ticket/CreateNewTicketByOrderId/' + data['inchargeUserId'], data)
  }

  _searchOrderHistory(orderNo) {
    return this.http.get(this.baseUrl + '/api/RetailOrder/GetRetailOrderHistoriesByOrderNo/' + orderNo)
  }
}
