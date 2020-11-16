import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderTicketNewDialogComponent } from './order-ticket-new-dialog.component'

describe('OrderTicketNewDialogComponent', () => {
  let component: OrderTicketNewDialogComponent
  let fixture: ComponentFixture<OrderTicketNewDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTicketNewDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTicketNewDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
