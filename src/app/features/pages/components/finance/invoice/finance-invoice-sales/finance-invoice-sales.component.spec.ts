import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FinanceInvoiceSalesComponent } from './finance-invoice-sales.component'

describe('FinanceInvoiceSalesComponent', () => {
  let component: FinanceInvoiceSalesComponent
  let fixture: ComponentFixture<FinanceInvoiceSalesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceInvoiceSalesComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceInvoiceSalesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
