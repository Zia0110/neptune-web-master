import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderConsumerImportComponent } from './order-consumer-import.component'

describe('OrderConsumerImportComponent', () => {
  let component: OrderConsumerImportComponent
  let fixture: ComponentFixture<OrderConsumerImportComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderConsumerImportComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsumerImportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
