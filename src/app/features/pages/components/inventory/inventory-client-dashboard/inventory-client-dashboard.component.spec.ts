import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InventoryClientDashboardComponent } from './inventory-client-dashboard.component'

describe('InventoryClientDashboardComponent', () => {
  let component: InventoryClientDashboardComponent
  let fixture: ComponentFixture<InventoryClientDashboardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryClientDashboardComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryClientDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
