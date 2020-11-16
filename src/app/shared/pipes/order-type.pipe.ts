import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigStore } from '../../core/services/app-config.store';

// This pipe is for conversion of order type i.e. (纸单 & 电子单)
// Receives a number
// Returns a string
@Pipe({name: 'OrderTypePipe'})

export class OrderTypePipe implements PipeTransform {
    constructor(
        private appConfigStore:AppConfigStore
    ){}
  transform(id: number): string {
    let orderTypes = this.appConfigStore.configOrderMapping.Project
    for (let type of orderTypes) {
        if ( id == type.ProjectId ){
            return type.ProjectName
        }
    }
    return null;
  }
}
