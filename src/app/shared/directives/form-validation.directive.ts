import { Validators } from '@angular/forms'
import { Injectable } from '@angular/core'

// Service for all form validations and form error messages
@Injectable()
export class FormValidationDirective {
  required() {
    return {
      name: 'required',
      validator: Validators.required,
      message: '必填',
    }
  }

  // Takes x as the required minlength
  minlength(x: number) {
    return {
      name: 'minlength',
      validator: Validators.minLength(x),
      message: '最少 ' + x + ' 个字符',
    }
  }

  // Takes x as the required maxlength
  maxlength(x: number) {
    return {
      name: 'maxlength',
      validator: Validators.minLength(x),
      message: '最多 ' + x + ' 个字符',
    }
  }

  // Validate for email
  email() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return {
      name: 'maxlength',
      validator: Validators.pattern(re),
      message: '必须是Email',
    }
  }

  // Standard for passwords, (combination of numbers and letters)
  passwordStandard() {}
}
