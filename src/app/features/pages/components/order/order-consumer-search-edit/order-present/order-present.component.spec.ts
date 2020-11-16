import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderPresentComponent } from './order-present.component'

describe('OrderPresentComponent', () => {
  let component: OrderPresentComponent
  let fixture: ComponentFixture<OrderPresentComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPresentComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPresentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
