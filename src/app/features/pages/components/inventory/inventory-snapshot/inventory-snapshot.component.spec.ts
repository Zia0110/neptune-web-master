import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InventorySnapshotComponent } from './inventory-snapshot.component'

describe('InventorySnapshotComponent', () => {
  let component: InventorySnapshotComponent
  let fixture: ComponentFixture<InventorySnapshotComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventorySnapshotComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySnapshotComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
