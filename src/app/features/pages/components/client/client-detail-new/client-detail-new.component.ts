import { Component, ViewChild, OnInit } from '@angular/core'
import { Validators } from '@angular/forms'
import { DynamicFormComponent } from '../../../../../shared/presentational-components/dynamic-form/dynamic-form.component'
import {
  FormFieldConfigInterface,
  FormValueInterface,
} from '../../../../../shared/presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { FormValidationDirective } from '../../../../../shared/directives/form-validation.directive'

@Component({
  selector: 'app-client-detail-new',
  templateUrl: './client-detail-new.component.html',
  styleUrls: ['./client-detail-new.component.css'],
})
export class ClientDetailNewComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent

  regConfig: FormFieldConfigInterface[]
  formChanges: FormValueInterface[]

  submit(value: any) {
    console.log(this.form.form.value)
  }

  constructor(private formValidations: FormValidationDirective) {}

  ngOnInit() {
    this.parseFormField()
  }

  parseFormField() {
    // Sample data
    this.regConfig = [
      {
        type: 'input',
        label: '客户名称',
        inputType: 'text',
        name: 'username',
        // class & style 定义样式 class:string  style:object
        class: 'p-2',
        style: { height: '50px', width: '200px', 'background-color': 'green' },
        validations: [this.formValidations.required()],
      },
      {
        type: 'input',
        label: '联系人',
        inputType: 'text',
        name: 'contactName',
        class: 'w-auto p-2',
        // value: "初始值2",
        validations: [this.formValidations.required(), this.formValidations.minlength(2)],
      },
      {
        type: 'input',
        label: '联系电话',
        inputType: 'text',
        name: 'contactPhone',
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'input',
        label: '电子邮件',
        inputType: 'text',
        name: 'email',
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'input',
        label: '地址',
        inputType: 'text',
        name: 'address',
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: '备用联系电话',
        inputType: 'text',
        name: 'secondPhone',
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: '银行账号',
        inputType: 'text',
        name: 'bankAcc',
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: '备注信息',
        inputType: 'text',
        name: 'comment',
        validations: [this.formValidations.required()],
        class: 'w-auto p-2',
      },
      {
        type: 'select',
        label: '客户级别',
        name: 'clientLevel',
        value: '未确定',
        // options: ["未确定", "A", "B", "C", "D"],
        class: 'w-auto p-2',
      },
      {
        type: 'select',
        label: '优惠协议计划',
        name: 'discountPlan',
        value: '未确定',
        // options: ["未确定", "A", "B", "C", "D"],
        class: 'w-auto p-2',
      },
      {
        type: 'date',
        label: '优惠开始日期',
        name: 'discountStartDate',
        class: 'w-auto p-2',
      },
      {
        type: 'date',
        label: '优惠结束日期',
        name: 'discountEndDate',
        class: 'w-auto p-2',
      },
      {
        type: 'button',
        label: 'Save',
      },
    ]
  }

  change() {
    this.formChanges = [
      { name: 'username', value: 'Victor' },
      { name: 'contactName', value: 'Victor Wu' },
      { name: 'contactPhone', value: '01230123' },
      { name: 'email', value: '123123123@g.com' },
      { name: 'address', value: '132 Vincent St' },
      { name: 'secondPhone', value: '3213210321' },
      { name: 'bankAcc', value: '123123123-00' },
      { name: 'comment', value: 'Qwer' },
      { name: 'clientLevel', value: 'A' },
      { name: 'discountPlan', value: 'B' },
    ]
    // this.form.changeControlValues(this.formChanges);
  }
}
