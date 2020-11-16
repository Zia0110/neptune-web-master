import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-order-consumer-generate',
  templateUrl: './order-consumer-generate.component.html',
  styleUrls: ['./order-consumer-generate.component.css'],
})
export class OrderConsumerGenerateComponent implements OnInit {
  orderForm: FormGroup

  searchValue: any

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit() {
    this.formInit()
    console.log(this.orderForm)
  }

  search() {
    console.log(this.searchValue)
  }

  formInit() {
    this.orderForm = this.formBuilder.group({
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

  saveForm(): void {
    console.log(this.orderForm)

    localStorage.setItem('order', JSON.stringify(this.orderForm.value))
  }

  formReset(): void {
    this.orderForm.reset()
  }

  addWorkItem(): void {}
}
