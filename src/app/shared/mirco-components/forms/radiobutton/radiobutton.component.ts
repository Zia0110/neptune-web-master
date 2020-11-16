import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FormFieldConfigInterface } from "../../../presentational-components/dynamic-form/dynamic-form-presentational.interface";
@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.css']
})
export class RadiobuttonComponent implements OnInit {
  field: FormFieldConfigInterface;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
