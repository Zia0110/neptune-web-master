import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FormFieldConfigInterface } from "../../../presentational-components/dynamic-form/dynamic-form-presentational.interface";
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  field: FormFieldConfigInterface;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
