import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderTicketListComponent } from './order-ticket-list.component'

describe('OrderTicketListComponent', () => {
  let component: OrderTicketListComponent
  let fixture: ComponentFixture<OrderTicketListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTicketListComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTicketListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
