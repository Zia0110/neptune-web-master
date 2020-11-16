import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../../../environments/environment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

@Injectable()
export class WarehouseEndpoint {
  baseUrl = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  userID = this.appConfigStore.userID

  constructor(private http: HttpClient, private appConfigStore: AppConfigStore) {}

  /* --- Warehouse List  仓库列表  --- */
  _getWarehousesList() {
    return this.http.get(this.baseUrl + '/api/warehouse')
  }

  _updateWarehouse(warehouse, warehouseId) {
    console.log(warehouse,warehouseId);
    return this.http.put(this.baseUrl + '/api/Warehouse/' + warehouseId, warehouse)
  }

  _newWarehouse(warehouse) {
    return this.http.post(this.baseUrl + '/api/warehouse', warehouse)
  }

  _deleteWarehouse(warehouseId) {
    return this.http.delete(this.baseUrl + '/api/warehouse/' + warehouseId)
  }

  /* ---  */

  _getOrdersByStatus() {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByStatus?status=5')
  }

  // For paper order check and send
  _getRetailOrderPaperExpress(data) {
    return this.http.post(this.baseUrl + '/api/StockRetailOrder/GetRetailOrderPaperExpress', data)
  }

  updateRetailOrderPaperExpress(data) {
    return this.http.put(this.baseUrl + '/api/StockRetailOrder/UpdateRetailOrderPaperExpress/' + this.userID, data)
  }

  // For paper order arrivals
  _getRetailOrderPaperBatchArrive() {
    return this.http.get(this.baseUrl + '/api/StockRetailOrder/GetRetailOrderPaperExpressArrive')
  }

  _updateRetailOrderPaperBatchArrivalDate(id) {
    return this.http.put(this.baseUrl + '/api/StockRetailOrder/UpdateRetailOrderPaperExpressArrive/' + id, null)
  }

  // For Warehouse inventory transfer 库存转移通知
  _getWarehouseInventoryTransferNotices() {
    return this.http.get(this.baseUrl + '/api/WarehouseWholeSaleOrder/WarehouseWholeSaleOrderNotice')
  }

  _getWarehouseInventoryTransferConfirms() {
    return this.http.get(this.baseUrl + '/api/WarehouseWholeSaleOrder/WarehouseWholeSaleOrderConfirm')
  }

  _updateWarehouseInventoryTransfersAsRead(id) {
    return this.http.put(this.baseUrl + '/api/WarehouseWholeSaleOrder/UpdateWarehouseWholeSaleOrderRead/' + id, null)
  }

  _getWarehouseInventoryTransferNotification(queryParams) {
    return this.http.get(this.baseUrl + '/api/WarehouseNotification?' + queryParams)
  }
  _updateWarehouseInventoryTransferNotification(Params) {
    return this.http.put(this.baseUrl + '/api/WarehouseNotification/UpdateStockChangeNotificationRead', Params)
  }
  //this is the orders before predispatch
  public getPreDispatchOrders() {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByStatus?status=4')
  }

  //this is the orders with rules
  public getStockRetailOrder() {
    return this.http.get(this.gzipBaseUrl + '/api/StockRetailOrder')
  }

  //this is the rules
  public getWarehouseRules() {
    return this.http.get(this.baseUrl + '/api/warehouserule')
  }

  public updateRuleToPreDispatchOrder(orderNo: string, ruleNo: number): void {
    console.log('Update orderNo and ruleNo: ', orderNo, ruleNo)
  }

  public updateRuleIdToStockOrders(orderIds: string[], ruleIds: number[], comments: string[], comments2: string[]) {
    // console.log(orderIds);
    // console.log(ruleIds);
    let resultJson: any[] = []
    for (let i = 0; i < orderIds.length; i++) {
      let newJson = {
        OrderId: orderIds[i],
        RuleId: ruleIds[i],
        dispatchComment: comments[i],
        dispatchComment2: comments2[i],
      }
      resultJson.push(newJson)
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      }),
    }
    console.log(resultJson)
    return this.http.put<any[]>(this.baseUrl + '/api/StockRetailOrder/' + this.userID, resultJson, httpOptions)
  }

  public _updateRuleIdToStockOrders(data) {
    return this.http.put(this.baseUrl + '/api/StockRetailOrder/' + this.userID, data)
  }

  public _outboundGET() {
    return this.http.get(this.gzipBaseUrl + '/api/StockRetailOrder/GetPickUpBatchInfo')
  }

  public _outboundPOST(data: string[]) {
    return this.http.post(this.baseUrl + '/api/StockRetailOrder/GetRetailOrderOutStock', data)
  }

  public _outboundPUT(data: any) {
    return this.http.put(this.baseUrl + '/api/StockRetailOrder/UpdateRetailOrderOutStock/' + this.userID, data)
  }

  public _outboundUndoPUT(data: any) {
    return this.http.put(this.baseUrl + '/api/StockRetailOrder/UndoRetailOrderOutStock/' + this.userID, data)
  }

  public _confirmationGet() {
    return this.http.get(this.baseUrl + '/api/StockWholeSaleOrder/GetStockConfirmWholeSaleOrder')
  }

  public _confirmationPut(data: any) {
    return this.http.put(this.baseUrl + '/api/StockWholeSaleOrder/StockConfirmWholeSaleOrder/' + this.userID, data)
  }

  public _pickupOrderGet(args) {
    return this.http.get(
      this.baseUrl +
        '/api/StockRetailOrder/GetPickupOrder?' +
        'warehouseId=' +
        args.warehouseId +
        '&' +
        'stockCustomerId=' +
        args.stockCustomerId +
        '&' +
        'productId=' +
        args.productId
    )
  }

  public _pickupOrderPost(data) {
    return this.http.post(this.baseUrl + '/api/StockRetailOrder/UpdatePickupOrders', data)
  }

  public _pickupOrderPut(batchId) {
    return this.http.put(this.baseUrl + '/api/StockRetailOrder/UpdatePickupOrderStatusByBatchId/' + batchId, '')
  }

  public createLostEvent(data, userId) {
    console.log(data)
    console.log(userId)
    return this.http.post(this.baseUrl + '/api/LostEvent/CreateLostEvent/' + userId, data)
  }

  public getLostEvent(para) {
    return this.http.get(this.baseUrl + '/api/LostEvent/GetLostEventByFilter?' + para)
  }

  public getPreDispatchStatusFour() {
    return this.http.get(this.gzipBaseUrl + '/api/StockRetailOrder/?status=4')
  }

  public deleteLostEvent(id) {
    return this.http.delete(this.baseUrl + '/api/LostEvent/DeleteLostEvent/' + this.userID + '?lostEventId=' + id)
  }

  public getPreDispatchStatusFive() {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByStatus?status=5')
  }

  public createTransferApplication(userId, body: any) {
    return this.http.post(this.baseUrl + '/api/Transfer/CreateTransferApplication/' + userId, body)
  }

  _getAllWarehouseRule() {
    return this.http.get(this.baseUrl + '/api/WarehouseRule')
  }

  _newWarehouseRule(data) {
    return this.http.post(this.baseUrl + '/api/WarehouseRule', data)
  }

  _updateWarehouseRule(id, data) {
    return this.http.put(this.baseUrl + '/api/WarehouseRule/' + id, data)
  }
}
