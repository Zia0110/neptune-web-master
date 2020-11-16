import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../../environments/environment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

@Injectable({
  providedIn: 'root',
})
export class ProductEndpoint {
  private baseUrl: any = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  userID = this.appConfigStore.userID

  constructor(private http: HttpClient, public appConfigStore: AppConfigStore) {}

  _getProductsList() {
    return this.http.get(this.gzipBaseUrl + '/api/Product/GetAllProduct')
  }

  _getBaseProductsList() {
    return this.http.get(this.gzipBaseUrl + '/api/BaseProduct/GetAllBaseProducts')
  }

  _addProductsList(data) {
    return this.http.post(this.baseUrl + '/api/Product', data)
  }

  _addBaseProductsList(data) {
    return this.http.post(this.baseUrl + '/api/BaseProduct', data)
  }

  _getProductDetails(id) {
    return this.http.get(this.baseUrl + `/api/Product/${id}`)
  }

  _getBaseProductDetails(id) {
    return this.http.get(this.baseUrl + `/api/BaseProduct/GetBaseProductById/${id}`)
  }

  _editProductDetails(id, productData) {
    return this.http.put(this.baseUrl + `/api/Product/${id}`, productData)
  }

  _editBaseProductDetails(id, productData) {
    return this.http.put(this.baseUrl + `/api/BaseProduct/${id}`, productData)
  }

  _ImageUpload(imageData) {
    return this.http.post(this.baseUrl + '/api/Common/UploadImage', imageData)
  }

  _getCategory1() {
    return this.http.get(this.baseUrl + '/api/ProdCategory/GetAllProdCategory1')
  }

  _getCategory2() {
    return this.http.get(this.baseUrl + '/api/ProdCategory/GetAllProdCategory2')
  }

  _getCategory3() {
    return this.http.get(this.baseUrl + '/api/ProdCategory/GetAllProdCategory3')
  }

  _getPlaceOfOrigin() {
    return this.http.get(this.baseUrl + '/api/PlaceOfOrigin')
  }

  _getSupplier() {
    return this.http.get(this.baseUrl + '/api/Supplier/GetAllDisplaySupplier')
  }

  _GetProductNameMapping() {
    return this.http.get(this.gzipBaseUrl + '/api/ProductNameMapping')
  }

  _PostNewProductNameMapping(data) {
    return this.http.post(this.baseUrl + '/api/ProductNameMapping', data)
  }

  _PutModifyProductNameMapping(id, data) {
    return this.http.put(this.baseUrl + '/api/ProductNameMapping/' + id, data)
  }

  _DeleteProductNameMapping(id) {
    return this.http.delete(this.baseUrl + '/api/ProductNameMapping/' + id)
  }

  _BatchDeleteProductNameMapping(data) {
    console.log(data)
    return this.http.put(this.baseUrl + '/api/ProductNameMapping/BatchDeleteProductNameMapping', data)
  }

  _newSupplier(data) {
    return this.http.post(this.baseUrl + '/api/Supplier', data)
  }

  _updateSupplier(id, data) {
    return this.http.put(this.baseUrl + '/api/Supplier/' + id, data)
  }

  _getAllSupplier() {
    return this.http.get(this.baseUrl + '/api/Supplier/GetAllSupplier')
  }

  _newBaseProductMapping(data) {
    return this.http.post(this.baseUrl + '/api/BaseProductMapping', data)
  }

  _getAllBaseProductMapping() {
    return this.http.get(this.gzipBaseUrl + '/api/BaseProductMapping')
  }

  _updateBaseProductMapping(id, data) {
    return this.http.put(this.baseUrl + '/api/BaseProductMapping/UpdateProductBaseProductMappingByProductId/' + id, data)
  }

  _getBaseProductMappingById(id) {
    return this.http.get(this.baseUrl + '/api/BaseProductMapping/GetBaseProductMappingsByProductId/' + id)
  }

  _getAllPlaceOfOrigin() {
    return this.http.get(this.baseUrl + '/api/PlaceOfOrigin')
  }

  _newPlaceOfOrigin(data) {
    return this.http.post(this.baseUrl + '/api/PlaceOfOrigin', data)
  }

  _updatePlaceOfOrigin(id, data) {
    return this.http.put(this.baseUrl + '/api/PlaceOfOrigin/' + id, data)
  }

  _GetProductCategory1() {
    return this.http.get(this.baseUrl + '/api/ProdCategory/GetAllProdCategory1')
  }

  _NewProductCategory1(data) {
    return this.http.post(this.baseUrl + '/api/ProdCategory/CreatePordCategory1', data)
  }

  _UpdateProductCategory1(id, data) {
    return this.http.put(this.baseUrl + '/api/ProdCategory/UpdatePordCategory1/' + id, data)
  }

  _GetProductCategory2() {
    return this.http.get(this.baseUrl + '/api/ProdCategory/GetAllProdCategory2')
  }

  _NewProductCategory2(data) {
    return this.http.post(this.baseUrl + '/api/ProdCategory/CreatePordCategory2', data)
  }

  _UpdateProductCategory2(id, data) {
    return this.http.put(this.baseUrl + '/api/ProdCategory/UpdatePordCategory2/' + id, data)
  }

  _GetProductCategory3() {
    return this.http.get(this.baseUrl + '/api/ProdCategory/GetAllProdCategory3')
  }

  _NewProductCategory3(data) {
    return this.http.post(this.baseUrl + '/api/ProdCategory/CreatePordCategory3', data)
  }

  _UpdateProductCategory3(id, data) {
    return this.http.put(this.baseUrl + '/api/ProdCategory/UpdatePordCategory3/' + id, data)
  }
}
