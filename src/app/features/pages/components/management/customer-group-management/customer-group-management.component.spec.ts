import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CustomerGroupManagementComponent } from './customer-group-management.component'

describe('CustomerGroupManagementComponent', () => {
  let component: CustomerGroupManagementComponent
  let fixture: ComponentFixture<CustomerGroupManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerGroupManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
