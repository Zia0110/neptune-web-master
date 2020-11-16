import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigStore } from '../../core/services/app-config.store';

// This pipe is for conversion of customer group
// Receives a number
// Returns a string
@Pipe({name: 'CustomerGroupPipe'})

export class CustomerGroupPipe implements PipeTransform {
    constructor(
        private appConfigStore:AppConfigStore
    ){}
  transform(id: number): string {
    let customerGroupId = this.appConfigStore.configOrderMapping.Currency
    for (let type of customerGroupId) {
        if ( id == type.CutomerGroupId1 ){
            return type.CutomerGroupId1
        }
    }
    return null;
  }
}
