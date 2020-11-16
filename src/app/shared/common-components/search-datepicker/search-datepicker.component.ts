import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { FormFieldConfigInterface, FormValueInterface } from '../../presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { Observable } from 'rxjs'
import { startWith, map } from 'rxjs/operators'
import * as moment from 'moment'

@Component({
  selector: 'app-search-datepicker',
  templateUrl: './search-datepicker.component.html',
  styleUrls: [],
})
export class SearchDatepickerComponent implements OnChanges {
  // Search box params
  @Input() public disabledDates
  @Input() public label

  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()

  date = new FormControl()
  constructor() {}
  // myFilter = (d: Date | null): boolean => {
  //     const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  // return day !== 0 && day !== 6;
  // }

  ngOnChanges(changes) {
    // console.log(changes)
  }

  submit() {
    if (this.date.value) {
      console.log(this.date.value)
      // this.outputData.emit(moment(this.date.value).format('YYYY-MM-DD'))
      this.outputData.emit(this.date.value)
    }
  }
}
