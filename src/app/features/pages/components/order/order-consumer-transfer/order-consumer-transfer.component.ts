import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { FormControl } from '@angular/forms'
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms'

@Component({
  selector: 'app-order-consumer-transfer',
  templateUrl: './order-consumer-transfer.component.html',
  styleUrls: ['./order-consumer-transfer.component.css'],
})
export class OrderConsumerTransferComponent implements OnInit {
  orderForm: FormGroup

  orderManage: FormGroup

  orderNum: string

  searchOrderNum: any

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit() {
    this.formInit()
    this.formManageInit()
    console.log(this.orderForm)
  }

  formInit() {
    this.orderForm = this.formBuilder.group({
      orderInfo: ['', [Validators.minLength(2), Validators.maxLength(500)]],
      orderNum: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      orderDescription: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      productNum: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      productAmount: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      receiver: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      phone: ['', [Validators.minLength(2), Validators.maxLength(15)]],
      province: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      city: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      add: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      agency: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      note: ['', [Validators.minLength(2), Validators.maxLength(50)]],
    })
  }
  searchOrder() {
    console.log(this.searchOrderNum)
  }

  formManageInit() {
    this.orderManage = this.formBuilder.group({
      reason: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      oldCustomer: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      newCustomer: ['', [Validators.minLength(2), Validators.maxLength(50)]],
    })
  }

  confirm(): void {
    console.log(this.orderManage)
  }

  saveForm(): void {
    console.log(this.orderForm)
    localStorage.setItem('order', JSON.stringify(this.orderForm.value))
  }

  formReset(): void {
    this.orderManage.reset()
  }

  addWorkItem(): void {}
}
