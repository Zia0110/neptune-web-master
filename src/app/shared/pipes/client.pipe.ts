import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'ClientPipe' })
export class ClientPipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}
  transform(id: number): string {
    let clientDatas = this.appConfigStore.appSettings.CustomerInfo.Customers
    for (let type of clientDatas) {
      if (id == type.CustomerId) {
        return type.CustomerName
      }
    }
    return null
  }
}
