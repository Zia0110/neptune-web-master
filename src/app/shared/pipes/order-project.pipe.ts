import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigStore } from '../../core/services/app-config.store';

// This pipe is for conversion of order Project types i.e. (paper or electronic)
// Receives a number
// Returns a string
@Pipe({name: 'OrderProjectPipe'})

export class OrderProjectPipe implements PipeTransform {
    constructor(
        private appConfigStore:AppConfigStore
    ){}
  transform(id: number): string {
    let projectTypes = this.appConfigStore.configOrderMapping.Project
    for (let type of projectTypes) {
        if ( id == type.ProjectId ){
            return type.ProjectName
        }
    }
    return null;
  }
}
