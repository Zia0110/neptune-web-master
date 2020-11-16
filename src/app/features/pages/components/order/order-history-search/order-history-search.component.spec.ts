import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OrderHistorySearchComponent } from './order-history-search.component'

describe('OrderHistorySearchComponent', () => {
  let component: OrderHistorySearchComponent
  let fixture: ComponentFixture<OrderHistorySearchComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderHistorySearchComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistorySearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
