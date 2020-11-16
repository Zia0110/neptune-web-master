import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderFunctionsComponent } from './order-functions.component'

describe('OrderFunctionsComponent', () => {
  let component: OrderFunctionsComponent
  let fixture: ComponentFixture<OrderFunctionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderFunctionsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFunctionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
