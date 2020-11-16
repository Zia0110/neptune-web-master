import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'TransportStatusPipe' })
export class TransportStatusPipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}

  transform(id: number): string {
    let transportStatus = this.appConfigStore.appSettings.Mapping.TransportStatus
    for (let type of transportStatus) {
      if (id == type.Status) {
        return type.StatusName
      }
    }
    return null
  }
}
