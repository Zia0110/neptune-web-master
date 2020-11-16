import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'ProductPipe' })
export class ProductPipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}
  transform(id: number): string {
    let productTypes = this.appConfigStore.appSettings.ProductInfo.Products
    for (let type of productTypes) {
      if (id == type.ProductId) {
        return type.ProductName
      }
    }
    return null
  }
}
