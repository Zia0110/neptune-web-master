import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InvoiceUpdateTableComponent } from './invoice-update-table.component'

describe('InvoiceUpdateTableComponent', () => {
  let component: InvoiceUpdateTableComponent
  let fixture: ComponentFixture<InvoiceUpdateTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceUpdateTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceUpdateTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
