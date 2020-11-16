import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { InventoryEndpoint } from '../../../features/pages/services/endpoints/inventory.endpoint'
import { ProductEndpoint } from '../../../features/pages/services/endpoints/product.endpoint'

@Injectable({
  providedIn: 'root',
})
export class SearchSelectionServiceService {
  products: any = []
  customers: any = []
  stockCustomers: any = []
  warehouses: any = []
  baseProducts = []

  constructor(private http: HttpClient, public appConfigStore: AppConfigStore, public productEndpoint: ProductEndpoint) {}

  /* BaseProduct */
  getBaseProductData() {
    return this.baseProducts
  }

  getBaseProductDataPromise() {
    this.productEndpoint
      ._getBaseProductsList()
      .toPromise()
      .then((res: any) => (this.baseProducts = res))
    return this.productEndpoint._getBaseProductsList()
  }

  /* Product */
  getProductData() {
    return this.products
  }

  getProductDataPromise() {
    this.appConfigStore
      .adminAppLoadProduct()
      .toPromise()
      .then((resp) => {
        this.products = resp
      })
    return this.appConfigStore.adminAppLoadProduct()
  }

  /* Customer */
  getCustomerData() {
    return this.customers
  }

  getCustomerDataPromise() {
    this.appConfigStore
      .adminAppLoadCustomer()
      .toPromise()
      .then((resp) => {
        this.customers = resp
      })
    return this.appConfigStore.adminAppLoadCustomer()
  }

  /* Stock Customer */
  getStockCustomerData() {
    return this.stockCustomers
  }

  getStockCustomerDataPromise() {
    this.http
      .get(environment.gzipBaseUrl + '/api/Customer/GetStockCustomer')
      .toPromise()
      .then((resp) => (this.stockCustomers = resp))
    return this.http.get(environment.gzipBaseUrl + '/api/Customer/GetStockCustomer')
  }

  getStockByBaseProductId(id) {
    return this.http.get(environment.baseUrl + '/api/Stock/GetStockByBaseProductId/' + id)
  }

  /* Warehouse */
  getWarehouseData() {
    return this.warehouses
  }

  getWarehouseDataPromise() {
    this.http
      .get(environment.baseUrl + '/api/warehouse')
      .toPromise()
      .then((resp) => (this.warehouses = resp))
    return this.http.get(environment.baseUrl + '/api/warehouse')
  }

  /* Stock Warehouse */
  getStockWarehouseDataPromise(productIdStockWarehouse) {
    const subUrl = '/api/FinancialWholeSaleOrder/GetWarehouseAndTransport/'
    return this.http.get(environment.baseUrl + subUrl + productIdStockWarehouse)
  }

  /* Stock Warehouse By BaseProductId and CustomerId */
  getStockWarehouseByBaseProductIdAndCustomerId(baseProductId, customerId) {
    const subUrl = '/api/Transfer/GetWarehouseAndTransport?baseProductId='
    return this.http.get(environment.baseUrl + subUrl + baseProductId + '&fromCustomerId=' + customerId)
  }
}
