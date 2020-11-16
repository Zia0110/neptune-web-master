import { Pipe, PipeTransform } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'

// This pipe is for conversion of warehouse from id to name
// Receives a number
// Returns a string
@Pipe({ name: 'WarehousePipe' })
export class WarehousePipe implements PipeTransform {
  constructor(private appConfigStore: AppConfigStore) {}
  transform(id: number): string {
    let projectTypes = this.appConfigStore.configOrderMapping.Project
    let warehouseTypes = this.appConfigStore.appSettings.Mapping.Warehouse
    for (let type of warehouseTypes) {
      if (id == type.WarehouseId) {
        return type.WarehouseName
      }
    }
    return null
  }
}
