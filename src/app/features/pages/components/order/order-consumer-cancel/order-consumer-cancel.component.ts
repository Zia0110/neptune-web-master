import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms'
import { MockData } from '../../../../../shared/mock-data'

@Component({
  selector: 'app-order-consumer-cancel',
  templateUrl: './order-consumer-cancel.component.html',
  styleUrls: ['./order-consumer-cancel.component.css'],
})
export class OrderConsumerCancelComponent implements OnInit {
  orderCancelForm: FormGroup
  orderSampleArray: any
  orderSample = {
    orderNumber: '',
    prodDescription: '',
    prodName: '',
    prodQuantity: null,
    receiverName: '',
    receiverPhone: '',
    state: '',
    city: '',
    address: '',
    statement: '',
    warehouse: '',
    orderStatus: '',
    agentCustomer: '',
    price: '',
  }

  constructor(private fb: FormBuilder, public mockDate: MockData) {}

  ngOnInit() {
    this.createOrderCancelForm()
  }
  createOrderCancelForm() {
    this.orderCancelForm = this.fb.group({
      orderNumber: [this.orderSample.orderNumber],
      reasonDescription: [],
      cancelOrNot: [],
      orderInfo: [],
      prodDescription: [this.orderSample.prodDescription],
      prodName: [this.orderSample.prodName],
      prodQuantity: [this.orderSample.prodQuantity],
      receiverName: [this.orderSample.receiverName],
      receiverPhone: [this.orderSample.receiverPhone],
      state: [this.orderSample.state],
      city: [this.orderSample.city],
      address: [this.orderSample.address],
      statement: [this.orderSample.statement],
      warehouse: [this.orderSample.warehouse],
      orderStatus: [this.orderSample.orderStatus],
      agentCustomer: [this.orderSample.agentCustomer],
      attachment: [],
      price: [this.orderSample.price],
    })
  }

  searchOrder() {
    this.orderSampleArray = this.mockDate.getOrderCancel()
    this.orderSample = this.orderSampleArray[0]
    console.log(this.orderSample)
    this.createOrderCancelForm()
  }

  save() {}
}
