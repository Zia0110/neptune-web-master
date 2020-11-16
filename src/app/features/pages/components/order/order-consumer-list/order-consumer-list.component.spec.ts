import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderConsumerListComponent } from './order-consumer-list.component'

describe('OrderConsumerListComponent', () => {
  let component: OrderConsumerListComponent
  let fixture: ComponentFixture<OrderConsumerListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderConsumerListComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsumerListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
