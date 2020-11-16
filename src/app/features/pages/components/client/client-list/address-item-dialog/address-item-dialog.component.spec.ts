import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddressItemDialogComponent } from './address-item-dialog.component'

describe('AddressItemDialogComponent', () => {
  let component: AddressItemDialogComponent
  let fixture: ComponentFixture<AddressItemDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressItemDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressItemDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
