import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { FormFieldConfigInterface } from '../../../presentational-components/dynamic-form/dynamic-form-presentational.interface'
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  field: FormFieldConfigInterface
  group: FormGroup
  appSearchSelection = false
  formControl = new FormControl('')

  constructor() {}

  ngOnInit() {
    this.formControl.setValue({ value: this.field.value, disabled: this.field.disabled })
    if (this.field.inputType == 'appSearchSelection') {
      this.appSearchSelection = true
      this.formControl.valueChanges.subscribe((res) => {
        this.field.value = res
        console.log(this.field, this.formControl)
      })
    }
  }
}
