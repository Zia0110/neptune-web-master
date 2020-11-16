import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderConsumerTransferComponent } from './order-consumer-transfer.component'

describe('OrderConsumerTransferComponent', () => {
  let component: OrderConsumerTransferComponent
  let fixture: ComponentFixture<OrderConsumerTransferComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderConsumerTransferComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsumerTransferComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
