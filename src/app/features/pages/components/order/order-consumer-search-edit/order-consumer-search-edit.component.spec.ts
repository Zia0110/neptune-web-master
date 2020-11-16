import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderConsumerSearchEditComponent } from './order-consumer-search-edit.component'

describe('OrderConsumerSearchEditComponent', () => {
  let component: OrderConsumerSearchEditComponent
  let fixture: ComponentFixture<OrderConsumerSearchEditComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderConsumerSearchEditComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsumerSearchEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
