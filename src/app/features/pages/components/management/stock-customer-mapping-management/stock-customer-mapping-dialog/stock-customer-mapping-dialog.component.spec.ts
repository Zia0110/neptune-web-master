import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StockCustomerMappingDialogComponent } from './stock-customer-mapping-dialog.component'

describe('StockCustomerMappingDialogComponent', () => {
  let component: StockCustomerMappingDialogComponent
  let fixture: ComponentFixture<StockCustomerMappingDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockCustomerMappingDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCustomerMappingDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
