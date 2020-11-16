import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'CustomerCodePipe' })
export class CustomerCodePipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}
  transform(id: number): string {
    let customerTypes = this.appConfigStore.appSettings.CustomerInfo.Customers
    for (let type of customerTypes) {
      if (id == type.CustomerId) {
        return type.CustomerCode
      }
    }
    return null
  }
}
