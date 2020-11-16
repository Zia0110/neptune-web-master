import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WarehouseOutboundComponent } from './warehouse-outbound.component'

describe('WarehouseOutboundComponent', () => {
  let component: WarehouseOutboundComponent
  let fixture: ComponentFixture<WarehouseOutboundComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseOutboundComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseOutboundComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
