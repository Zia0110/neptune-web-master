import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WarehousePickupOrderComponent } from './warehouse-pickup-order.component'

describe('WarehousePickupOrderComponent', () => {
  let component: WarehousePickupOrderComponent
  let fixture: ComponentFixture<WarehousePickupOrderComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarehousePickupOrderComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousePickupOrderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
