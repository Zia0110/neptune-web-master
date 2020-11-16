import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StockCustomerMappingManagementComponent } from './stock-customer-mapping-management.component'

describe('StockCustomerMappingManagementComponent', () => {
  let component: StockCustomerMappingManagementComponent
  let fixture: ComponentFixture<StockCustomerMappingManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockCustomerMappingManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCustomerMappingManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
