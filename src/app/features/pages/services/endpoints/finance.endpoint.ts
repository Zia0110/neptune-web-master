import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { environment } from '../../../../../environments/environment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

@Injectable()
export class FinanceEndpoint {
  baseUrl = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  userID = this.appConfigStore.userID

  constructor(private http: HttpClient, private appConfigStore: AppConfigStore) {}

  // For Credit Management List
  _getCreditLists(queryParams) {
    return this.http.get(this.baseUrl + '/api/Credit/GetCreditByFilter?' + queryParams)
  }
  _updateCreditNo(creditList) {
    return this.http.put(this.baseUrl + '/api/Credit/UpdateCreditNoByCreditId', creditList)
  }

  // Get Bulk Special Price
  _getBulkUpdateSpecialPrice(data) {
    return this.http.post(this.baseUrl + '/api/SpecialPrice/GetBulkUpdateSpecialPrice', data)
  }

  // Bulk Update Special Price
  _bulkUpdateSpecialPrice(data) {
    return this.http.post(this.baseUrl + '/api/SpecialPrice/BulkUpdateSpecialPrice', data)
  }

  _updateCreditProcessed(creditId, creditNo) {
    return this.http.put(this.baseUrl + '/api/Credit/UpdateCreditProcessedByCreditId/' + creditId + '/' + creditNo, null)
  }

  _getBatchUpdateRetailOrdersPriceAndComment3(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/GetBatchUpdateRetailOrdersPriceAndComment3', data)
  }

  _batchUpdateRetailOrdersPriceAndComment3(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/BatchUpdateRetailOrdersPriceAndComment3/' + this.userID, data)
  }

  _getBatchUpdateTrackingInfo(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/GetBatchUpdateRetailOrderTrackingNoAndComment', data)
  }

  _batchUpdateTrackingInfo(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/BatchUpdateRetailOrderTrackingNoAndComment/' + this.userID, data)
  }

  _UpdateWholeSaleOrderBeforePaid(orderId, data) {
    return this.http.post(this.baseUrl + '/api/FinancialWholeSaleOrder/UpdateWholeSaleOrderBeforePaid/' + orderId, data)
  }

  public deletePurchaseOrder(orderNo) {
    return this.http.delete(this.baseUrl + '/api/PurchaseOrder/DeletePurchaseOrderByOrderNo/' + this.userID + '?orderNo=' + orderNo)
  }

  public deleteWholesaleOrder(orderId) {
    return this.http.delete(this.baseUrl + '/api/StockWholeSaleOrder/DeleteWholeSaleOrder/' + this.userID + '?orderId=' + orderId)
  }

  _updateWholeSaleModificationComment(data) {
    return this.http.put(this.baseUrl + '/api/StockWholeSaleOrder/UpdateWholeSaleOrderComment', data)
  }

  // For Finance order authorise (订单批准)
  _getOrdersConsumerByStatus(status) {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/GetRetailOrderByStatus?status=2&status=3')
  }

  _getFinanceOrderAuthoriseOrders(isCustomerProducts) {
    return isCustomerProducts
      ? this.http.get(this.gzipBaseUrl + '/api/RetailOrder/CSRGetCustomerProductRetailOrder?status=2&status=3')
      : this.http.get(this.gzipBaseUrl + '/api/RetailOrder/FinancialApproveGetRetailOrder?status=2&status=3')
  }

  _updateOrdersConsumerFinanceApproved(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/UpdateretailOrderFinancialApprove/' + this.userID, data)
  }

  _getFinanceOrderByOrderNo(orderNo) {
    return this.http.get(this.gzipBaseUrl + '/api/RetailOrder/FinancialApproveGetRetailOrderByOrderNo/' + orderNo)
  }

  _getFinanceBatchChangeProductPricesByClientIds(datas) {
    return this.http.post(this.baseUrl + '/api/PriceList/BatchGetCurrentProductCustomerPrices', datas)
  }

  _getFinanceBatchChangeStockByProductId(productId) {
    return this.http.get(this.baseUrl + '/api/Stock/GetStockByProductId/' + productId)
  }

  _getFinanceProductPackageDetails(productId) {
    return this.http.get(this.baseUrl + '/api/product/GetProductBaseProductByProductId/' + productId)
  }

  _getProductDetails(id) {
    return this.http.get(this.baseUrl + `/api/Product/${id}`)
  }

  _getClientDetails(id) {
    return this.http.get(this.baseUrl + `/api/Customer/${id}`)
  }

  _getClientParentDetails(id) {
    return this.http.get(this.baseUrl + `/api/Customer/GetSameParentCompanyStockCustomer/${id}`)
  }

  // For Finance Cin7 exports
  _getOrdersForCin7Export() {
    return this.http.get(this.baseUrl + '/api/ExportCin7/FinancialGetExportCin7')
  }

  _financialUpdateExtraCin7Batch(data) {
    return this.http.put(this.baseUrl + '/api/ExportCin7/FinancialUpdateExtraCin7Batch', data)
  }

  _getOrdersForCin7ByBatchId(batchId) {
    return this.http.get(this.baseUrl + '/api/ExportCin7/FinancialGetExportCin7BatchById?batchId=' + batchId)
  }

  _getBatchIdForCin7ByDates(beginDate, endDate) {
    return this.http.get(
      this.baseUrl +
        '/api/ExportCin7/FinancialGetAllExportCin7BatchByDate?beginDate=' +
        this.getUTCdate(beginDate) +
        '&endDate=' +
        this.getUTCdate(endDate)
    )
  }

  _getOrdersForCin7ByClientId(clientId) {
    return this.http.get(this.baseUrl + '/api/ExportCin7/FinancialGetExportCin7DetailByCustomerId?customerId=' + clientId)
  }

  _updateOrdersOnCin7Export(data) {
    return this.http.put(this.baseUrl + '/api/ExportCin7/' + this.userID, data)
  }

  // Update indiviual order
  _updateOrderConsumerFinance(data) {
    return this.http.put(this.baseUrl + '/api/RetailOrder/UpdateRetailOrderByOrderNo/' + this.userID, data)
  }

  _getStocksByProductId(productId) {
    return this.http.get(this.baseUrl + '/api/Stock/GetStockByProductId/' + productId)
  }

  _getOrderProductCustomerPrice(queryParams) {
    return this.http.get(this.baseUrl + '/api/PriceList/GetCurrentProductCustomerPrice?' + queryParams)
  }

  // For Finance invoice payment (批发发票付款)
  _getFinanceWholeSaleInvoices() {
    return this.http.get(this.baseUrl + '/api/FinancialWholeSaleOrder/GetUnpaidWholeSaleInvoice')
  }

  _updateFinanceWholeSaleInvoicePaid(invoiceId) {
    return this.http.put(this.baseUrl + '/api/FinancialWholeSaleOrder/WholeSaleInvoicePay/' + invoiceId + '?userId=' + this.userID, null)
  }

  _invoiceGenerateGetCustomerInfo(id) {
    return this.http.get(this.baseUrl + '/api/Customer/' + id)
  }

  _invoiceGeneratePost(data) {
    return this.http.post(this.baseUrl + '/api/FinancialWholeSaleOrder/CreateWholeSaleOrder/' + this.userID, data)
  }

  _getProductPriceList() {
    return this.http.get(this.baseUrl + '/api/pricelist')
  }

  _updateProductPriceList(data) {
    console.log(data)
    return this.http.put(this.baseUrl + '/api/pricelist', data)
  }

  _createPurchaseOrderPOST(data) {
    return this.http.post(this.baseUrl + '/api/PurchaseOrder/CreatePurchaseOrder/' + this.userID, data)
  }

  // _getNewPurchaseOrder(status) {
  //   return this.http.get(this.baseUrl + '/api/PurchaseOrder/GetPurchaseOrderByStatus/' + status)
  // }

  _confirmPurchaseOrderStockin(data) {
    return this.http.put(this.baseUrl + '/api/PurchaseOrder/UpdatePurchaseOrderStockIn/' + this.userID, data)
  }

  _getCustomerGroupEmailAddress(id) {
    return this.http.get(this.baseUrl + '/api/PriceList/GetCustomerEmailListByCustomerGroup1Id/' + id)
  }

  _getSpecialPrice() {
    return this.http.get(this.baseUrl + '/api/SpecialPrice')
  }

  _deleteSpecialPrice(priceId) {
    return this.http.delete(this.baseUrl + '/api/SpecialPrice/DeleteSpecialPrice/' + priceId)
  }

  _addSpecialPrice(data) {
    return this.http.post(this.baseUrl + '/api/SpecialPrice/CreateSpecialPrice', data)
  }

  _updateSpecialPrice(priceId, data) {
    return this.http.put(this.baseUrl + '/api/SpecialPrice/UpdateSpecialPrice/' + priceId, data)
  }

  _postCreditImport(data) {
    return this.http.post(this.baseUrl + '/api/CustomerCredit', data)
  }

  _postCin7Import(data) {
    return this.http.post(this.baseUrl + '/api/ImportCin7Invoice', data)
  }
  _postCin7ImportAsOrder(data) {
    return this.http.post(this.baseUrl + '/api/ImportCin7Invoice/ImportCin7InvoiceFromOrderNo', data)
  }
  _postReferenceImportOrderNo(data) {
    return this.http.post(this.baseUrl + '/api/ImportCin7Invoice/ImportReferenceOrderNo', data)
  }
  getUTCdate(dateString) {
    // console.log(dateString)
    // console.log(new Date(dateString))
    // console.log(new Date(dateString).toUTCString())
    // console.log(new Date(dateString).toISOString())
    // console.log(new Date(dateString).toISOString().replace(/\..+/, ''))
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  _GetInfiniteUpdateWholeSaleOrder(beginDate?: string, endDate?: string) {
    const now = new Date()
    const currentDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    const last30days = new Date(now.setDate(now.getDate() - 30))
    const startDateString = `${last30days.getFullYear()}-${last30days.getMonth() + 1}-${last30days.getDate()}`
    return beginDate && endDate
      ? this.http.get(
          this.baseUrl +
            '/api/StockWholeSaleOrder/GetInfiniteUpdateWholeSaleOrder?beginDate=' +
            this.getUTCdate(beginDate) +
            '&endDate=' +
            this.getUTCdate(endDate)
        )
      : this.http.get(
          this.baseUrl +
            '/api/StockWholeSaleOrder/GetInfiniteUpdateWholeSaleOrder?beginDate=' +
            this.getUTCdate(startDateString) +
            '&endDate=' +
            this.getUTCdate(currentDateString)
        )
  }

  _PutInfiniteUpdateWholeSaleOrder(data) {
    return this.http.put(this.baseUrl + '/api/StockWholeSaleOrder/InfiniteUpdateWholeSaleOrder', data)
  }

  _GetPriceListHistoryDate() {
    return this.http.get(this.gzipBaseUrl + '/api/PriceList/GetPriceHistoryDate')
  }

  _GetAllProductsPriceListHistoryByDate(beginDate, endDate, productId?) {
    return productId
      ? this.http.get(
          this.gzipBaseUrl +
            '/api/PriceList/GetAllProductPriceHistoryByDate/?productId=' +
            productId +
            '&effectiveDate=' +
            beginDate +
            '&expiryDate=' +
            endDate
        )
      : this.http.get(this.baseUrl + '/api/PriceList/GetAllProductPriceHistoryByDate/?effectiveDate=' + beginDate + '&expiryDate=' + endDate)
  }

  UpdatePrice(data) {
    return this.http.put(this.baseUrl + '/api/PriceList/UpdateProductPrice', data)
  }

  _GetPurchaseOrderByDate(beginDate, endDate) {
    return this.http.get(
      this.baseUrl + '/api/PurchaseOrder/GetPurchaseOrderByDate?beginDate=' + this.getUTCdate(beginDate) + '&endDate=' + this.getUTCdate(endDate)
    )
  }

  _GetPriceViewDataById(id, beginDate, endDate) {
    return this.http.get(this.baseUrl + '/api/Product/GetProductPriceHistoryByDate/' + id + '?beginDate=' + beginDate + '&endDate=' + endDate)
  }
}
