import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InventoryDetailClientComponent } from './inventory-client-purchase.component'

describe('InventoryDetailClientComponent', () => {
  let component: InventoryDetailClientComponent
  let fixture: ComponentFixture<InventoryDetailClientComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryDetailClientComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailClientComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
