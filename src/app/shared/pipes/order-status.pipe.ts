import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigStore } from '../../core/services/app-config.store';

// This pipe is for conversion of order status types i.e. (新建 & 与分仓 & 出库))
// Receives a number
// Returns a string
@Pipe({name: 'OrderStatusPipe'})

export class OrderStatusPipe implements PipeTransform {
    constructor(
        private appConfigStore:AppConfigStore
    ){}
  transform(id: number): string {
    let statusTypes = this.appConfigStore.configOrderMapping.RetailOrderStatus
    for (let type of statusTypes) {
        if ( id == type.Status ){
            return type.StatusName
        }
    }
    return null;
  }
}
