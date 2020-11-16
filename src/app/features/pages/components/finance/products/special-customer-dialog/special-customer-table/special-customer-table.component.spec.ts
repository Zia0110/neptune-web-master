import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SpecialCustomerTableComponent } from './special-customer-table.component'

describe('SpecialCustomerTableComponent', () => {
  let component: SpecialCustomerTableComponent
  let fixture: ComponentFixture<SpecialCustomerTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialCustomerTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCustomerTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
