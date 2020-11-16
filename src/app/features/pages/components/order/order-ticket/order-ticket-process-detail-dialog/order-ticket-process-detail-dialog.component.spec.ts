import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderTicketProcessDetailDialogComponent } from './order-ticket-process-detail-dialog.component'

describe('OrderTicketProcessDetailDialogComponent', () => {
  let component: OrderTicketProcessDetailDialogComponent
  let fixture: ComponentFixture<OrderTicketProcessDetailDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTicketProcessDetailDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTicketProcessDetailDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
