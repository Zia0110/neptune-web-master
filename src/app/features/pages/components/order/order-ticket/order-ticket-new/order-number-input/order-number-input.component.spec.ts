import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderNumberInputComponent } from './order-number-input.component'

describe('OrderNumberInputComponent', () => {
  let component: OrderNumberInputComponent
  let fixture: ComponentFixture<OrderNumberInputComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderNumberInputComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNumberInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
