import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'TransportTypePipe' })
export class TransportTypePipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}

  transform(id: number): string {
    let transportTypes = this.appConfigStore.appSettings.Mapping.TransportType
    for (let type of transportTypes) {
      if (id == type.TransportTypeId) {
        return type.TransportTypeName
      }
    }
    return null
  }
}
