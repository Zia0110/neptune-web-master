import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InvoiceUpdateDialogComponent } from './invoice-update-dialog.component'

describe('InvoiceUpdateDialogComponent', () => {
  let component: InvoiceUpdateDialogComponent
  let fixture: ComponentFixture<InvoiceUpdateDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceUpdateDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceUpdateDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
