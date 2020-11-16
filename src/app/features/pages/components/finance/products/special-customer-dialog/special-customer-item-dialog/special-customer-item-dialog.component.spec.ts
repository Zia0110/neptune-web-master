import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { SpecialCustomerItemDialogComponent } from './special-customer-item-dialog.component'

describe('SpecialCustomerItemDialogComponent', () => {
  let component: SpecialCustomerItemDialogComponent
  let fixture: ComponentFixture<SpecialCustomerItemDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialCustomerItemDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCustomerItemDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
