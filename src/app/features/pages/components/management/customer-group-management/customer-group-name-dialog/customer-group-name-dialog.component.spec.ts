import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CustomerGroupNameDialogComponent } from './customer-group-name-dialog.component'

describe('CustomerGroupNameDialogComponent', () => {
  let component: CustomerGroupNameDialogComponent
  let fixture: ComponentFixture<CustomerGroupNameDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerGroupNameDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupNameDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
