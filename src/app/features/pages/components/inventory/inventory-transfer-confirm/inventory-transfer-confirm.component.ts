import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-inventory-transfer-confirm',
  templateUrl: './inventory-transfer-confirm.component.html',
  styleUrls: ['./inventory-transfer-confirm.component.css'],
})
export class InventoryTransferConfirmComponent implements OnInit {
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
