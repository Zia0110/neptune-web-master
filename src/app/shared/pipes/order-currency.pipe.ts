import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigStore } from '../../core/services/app-config.store';

// This pipe is for conversion of order currency types i.e. (NZD & CNY & USD)
// Receives a number
// Returns a string
@Pipe({name: 'OrderCurrencyPipe'})

export class OrderCurrencyPipe implements PipeTransform {
    constructor(
        private appConfigStore:AppConfigStore
    ){}
  transform(id: number): string {
    let currencyTypes = this.appConfigStore.configOrderMapping.Currency
    for (let type of currencyTypes) {
        if ( id == type.CurrencyId ){
            return type.CurrencyName
        }
    }
    return null;
  }
}
