import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InventoryOutputManagementComponent } from './inventory-output-management.component'

describe('InventoryOutputManagementComponent', () => {
  let component: InventoryOutputManagementComponent
  let fixture: ComponentFixture<InventoryOutputManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryOutputManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOutputManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
