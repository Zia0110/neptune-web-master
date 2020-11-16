import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { FormFieldConfigInterface, FormValueInterface } from '../../presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { Observable, Subject } from 'rxjs'
import { startWith, map } from 'rxjs/operators'
import * as moment from 'moment'

@Component({
  selector: 'app-simple-dropdown',
  templateUrl: './simple-dropdown.component.html',
  styleUrls: [],
})
export class SimpleDropdownComponent implements OnChanges {
  // Search box params
  @Input() public data
  @Input() public label
  @Input() public pickedCustomerId
  @Input() public selected = 0

  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()

  constructor() {}

  ngOnChanges(changes) {
    // this is only used in inventory-inquiry,
    //when user changes the customer, we need to update the selected so it is empty again.
    if (changes['pickedCustomerId']) {
      let previousCustomerId = changes['pickedCustomerId']['previousValue']
      let currentCustomerId = changes['pickedCustomerId']['currentValue']
      if (previousCustomerId != currentCustomerId) {
        this.selected = 0
      }
    }
  }

  submit() {
    this.outputData.emit(this.selected)
  }
}
