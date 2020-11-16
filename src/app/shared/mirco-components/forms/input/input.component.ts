import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormFieldConfigInterface } from '../../../presentational-components/dynamic-form/dynamic-form-presentational.interface'
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  field: FormFieldConfigInterface
  group: FormGroup
  textarea = false
  constructor() {}

  ngOnInit() {
    // console.log(this.field)
    if (this.field.inputType == 'textarea') {
      this.textarea = true
    }
  }
}
