import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { FormFieldConfigInterface, Validator, FormValueInterface } from './dynamic-form-presentational.interface'
import { DynamicButtonComponent } from '../dynamic-button/dynamic-button.component'

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
})

// This is a presentational component for Form generation

// Input FormField Standards
// takes array of form input objects with:
//   type (input & date & button)
//   label (string)
//   inputType? (text & number)
//   name (corresponds to formControlName)
//   options? (use only for options in dropdown & select & radio )
//   validations? (for validations parsing)

// Input FormValues Standards
// takes array of form value objects with:
// name (correspondes to formControlName)
// value (pre-set value of the field)

// Output
// Outputs form values after validation when submit triggered
export class DynamicFormComponent implements OnChanges {
  // Input form values
  @Input() formValues: FormValueInterface[]
  // Input form build
  @Input() formFields: FormFieldConfigInterface[]
  // Outputting form results (form values only)
  @Output() submit: EventEmitter<any> = new EventEmitter<any>()
  @Output() warehouseSubmit: EventEmitter<any> = new EventEmitter<any>()

  form: FormGroup

  constructor(private fb: FormBuilder) {}

  // Use OnChanges -> fires only when input changes
  ngOnChanges(changes) {
    console.log(changes)

    // Runs if formfields changed
    if (changes.formFields && changes.formFields.currentValue) {
      this.form = this.createControl(this.formFields)
    }

    // Runs if formvalues changed
    if (changes.formValues && changes.formValues.currentValue) {
      this.changeControlValues(changes.formValues.currentValue)
    }

    this.form.valueChanges.subscribe((res) => this.warehouseSubmit.emit(res))
  }

  // Initialise Form -> Create form controls
  createControl(formFields: FormFieldConfigInterface[]) {
    let formGroup = this.fb.group({})
    formFields.forEach((field) => {
      if (field.type === 'button') return
      const control = this.fb.control(field.value, this.bindValidations(field.validations || []))
      formGroup.addControl(field.name, control)
    })
    return formGroup
  }

  // Initialise Form -> Bind form validations
  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = []
      validations.forEach((valid) => {
        validList.push(valid.validator)
      })
      return Validators.compose(validList)
    }
    return null
  }

  // Takes value from Form value input -> Fired on Value input changes
  changeControlValues(formValues) {
    for (let formValue in formValues) {
      this.form.controls[formValue]?.setValue(formValues[formValue])
    }
  }

  // Form actions -> Submiting changes for form
  onSubmit(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    if (this.form.valid || this.form.dirty) {
      this.submit.emit(this.form.value)
    } else {
      this.validateAllFormFields(this.form)
    }
  }

  // Validate form
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field)
      control.markAsTouched({ onlySelf: true })
    })
  }
}
