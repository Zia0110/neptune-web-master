import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ChangeCustomerDialogComponent } from './change-customer-dialog.component'

describe('ChangeCustomerDialogComponent', () => {
  let component: ChangeCustomerDialogComponent
  let fixture: ComponentFixture<ChangeCustomerDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeCustomerDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCustomerDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
