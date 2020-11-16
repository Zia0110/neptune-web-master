import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FinanceInvoiceGenerateComponent } from './finance-invoice-generate.component'

describe('FinanceInvoiceGenerateComponent', () => {
  let component: FinanceInvoiceGenerateComponent
  let fixture: ComponentFixture<FinanceInvoiceGenerateComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceInvoiceGenerateComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceInvoiceGenerateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
