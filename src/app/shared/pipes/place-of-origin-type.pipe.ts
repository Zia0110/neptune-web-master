import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of Place of Origin from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'PlaceOfOriginPipe' })
export class PlaceOfOriginPipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}
  transform(id: number): string {
    let originTypes = this.appConfigStore.appSettings.Mapping.PlaceOfOrigin
    for (let type of originTypes) {
      if (id == type.PlaceOfOriginId) {
        return type.PlaceOfOrigin1
      }
    }
    return null
  }
}
