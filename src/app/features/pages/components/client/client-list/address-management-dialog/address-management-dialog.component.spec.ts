import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddressManagementDialogComponent } from './address-management-dialog.component'

describe('AddressManagementDialogComponent', () => {
  let component: AddressManagementDialogComponent
  let fixture: ComponentFixture<AddressManagementDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressManagementDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressManagementDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
