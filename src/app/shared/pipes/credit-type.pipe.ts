import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'CreditTypePipe' })
export class CreditTypePipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}
  transform(id: number): string {
    let creditTypes = this.appConfigStore.appSettings.Mapping.CreditType
    for (let type of creditTypes) {
      if (id == type.CreditType1) {
        return type.CreditTypeName
      }
    }
    return null
  }
}
