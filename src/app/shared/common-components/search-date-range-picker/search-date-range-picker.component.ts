import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { FormFieldConfigInterface, FormValueInterface } from '../../presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { Observable } from 'rxjs'
import { startWith, map } from 'rxjs/operators'
import * as moment from 'moment'

@Component({
  selector: 'app-search-date-range-picker',
  templateUrl: './search-date-range-picker.component.html',
  styleUrls: [],
})
export class SearchDateRangePickerComponent implements OnChanges {
  // Search box params
  @Input() public label

  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()

  date = new FormControl()
  constructor() {}

  ngOnChanges(changes) {
    // console.log(changes)
  }

  submit(values) {
    if (values && values.begin && values.end) {
      console.log(values)
      // console.log(values.begin)
      let begin = moment(values.begin).format('YYYY-MM-DD 00:00:00')
      let end = moment(values.end).format('YYYY-MM-DD 00:00:00')

      // console.warn(begin, end)
      this.outputData.emit({ begin, end })
    } else {
      this.outputData.emit({ begin: '', end: '' })
    }
  }
}
