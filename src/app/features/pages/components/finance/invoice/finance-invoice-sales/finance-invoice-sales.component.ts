import { Component, ViewChild, OnInit } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { DynamicButtonComponent } from '../../../../../../shared/presentational-components/dynamic-button/dynamic-button.component'
DynamicButtonComponent

@Component({
  selector: 'app-finance-invoice-sales',
  templateUrl: './finance-invoice-sales.component.html',
  styleUrls: ['./finance-invoice-sales.component.css'],
})
export class FinanceInvoiceSalesComponent implements OnInit {
  // @ViewChild(DynamicButtonComponent) form: DynamicButtonComponent
  // buttonUsage: string
  // dynamicButtonConfigureForm: FormGroup
  // use: any
  // buttonConfig = {
  //   name: '',
  //   product: '',
  //   usage: '',
  //   color: '',
  // }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // // For dev & demo purpose, provide a form to customise the button.
    // this.dynamicButtonConfigureForm = this.fb.group({
    //   name: [''],
    //   product: [''],
    //   usage: [''],
    //   color: ['accent'],
    // })
  }

  // onSubmit() {
  //   this.buttonConfig = {
  //     name: this.dynamicButtonConfigureForm['controls'].name.value,
  //     product: this.dynamicButtonConfigureForm['controls'].product.value,
  //     usage: this.dynamicButtonConfigureForm['controls'].usage.value,
  //     color: this.dynamicButtonConfigureForm['controls'].color.value,
  //   }
  //   this.use = this.dynamicButtonConfigureForm['controls'].usage.value
  //   console.log('Parent Config:', this.buttonConfig)
  // }

  // get name() {
  //   return this.dynamicButtonConfigureForm.get('name')
  // }

  // get usage() {
  //   return this.dynamicButtonConfigureForm.get('usage')
  // }

  // get color() {
  //   return this.dynamicButtonConfigureForm.get('color')
  // }
}
