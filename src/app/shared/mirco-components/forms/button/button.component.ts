import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormFieldConfigInterface } from '../../../presentational-components/dynamic-form/dynamic-form-presentational.interface'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  field: FormFieldConfigInterface
  group: FormGroup
  constructor() {}

  ngOnInit() {}
}
