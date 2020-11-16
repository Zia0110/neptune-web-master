import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'CustomMediumDatePipe'
})
export class CustomMediumDatePipe extends
    DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return super.transform(value, "d MMMM y hh:mm");
    }
}
