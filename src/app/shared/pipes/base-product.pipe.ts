import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'BaseProductPipe' })
export class BaseProductPipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}
  transform(id: number): string {
    let productTypes = this.appConfigStore.appSettings.ProductInfo.BaseProducts
    for (let type of productTypes) {
      if (id == type.BaseProductId) {
        return type.ProductName
      }
    }
    return null
  }
}
