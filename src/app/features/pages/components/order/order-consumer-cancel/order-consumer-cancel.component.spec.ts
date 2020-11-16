import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderConsumerCancelComponent } from './order-consumer-cancel.component'

describe('OrderConsumerCancelComponent', () => {
  let component: OrderConsumerCancelComponent
  let fixture: ComponentFixture<OrderConsumerCancelComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderConsumerCancelComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsumerCancelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
