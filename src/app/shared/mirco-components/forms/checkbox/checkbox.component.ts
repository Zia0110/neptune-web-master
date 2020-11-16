import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FormFieldConfigInterface } from "../../../presentational-components/dynamic-form/dynamic-form-presentational.interface";
@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  field: FormFieldConfigInterface;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
