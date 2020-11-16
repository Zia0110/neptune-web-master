import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FinanceInvoiceUpdateComponent } from './finance-invoice-update.component'

describe('FinanceInvoiceUpdateComponent', () => {
  let component: FinanceInvoiceUpdateComponent
  let fixture: ComponentFixture<FinanceInvoiceUpdateComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceInvoiceUpdateComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceInvoiceUpdateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
