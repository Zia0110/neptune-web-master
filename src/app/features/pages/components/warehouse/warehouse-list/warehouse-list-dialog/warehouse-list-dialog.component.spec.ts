import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WarehouseListDialogComponent } from './warehouse-list-dialog.component'

describe('WarehouseListDialogComponent', () => {
  let component: WarehouseListDialogComponent
  let fixture: ComponentFixture<WarehouseListDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseListDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseListDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
