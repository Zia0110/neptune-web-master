import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SupplierItemDialogComponent } from './supplier-item-dialog.component'

describe('SupplierItemDialogComponent', () => {
  let component: SupplierItemDialogComponent
  let fixture: ComponentFixture<SupplierItemDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierItemDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierItemDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
