import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderConsumerGenerateComponent } from './order-consumer-generate.component'

describe('OrderConsumerGenerateComponent', () => {
  let component: OrderConsumerGenerateComponent
  let fixture: ComponentFixture<OrderConsumerGenerateComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderConsumerGenerateComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsumerGenerateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
