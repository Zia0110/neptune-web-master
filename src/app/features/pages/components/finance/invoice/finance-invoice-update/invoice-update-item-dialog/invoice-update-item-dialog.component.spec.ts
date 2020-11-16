import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InvoiceUpdateItemDialogComponent } from './invoice-update-item-dialog.component'

describe('InvoiceUpdateItemDialogComponent', () => {
  let component: InvoiceUpdateItemDialogComponent
  let fixture: ComponentFixture<InvoiceUpdateItemDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceUpdateItemDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceUpdateItemDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
