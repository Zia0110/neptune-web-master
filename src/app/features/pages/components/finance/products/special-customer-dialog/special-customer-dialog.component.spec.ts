import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SpecialCustomerDialogComponent } from './special-customer-dialog.component'

describe('SpecialCustomerDialogComponent', () => {
  let component: SpecialCustomerDialogComponent
  let fixture: ComponentFixture<SpecialCustomerDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialCustomerDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCustomerDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
