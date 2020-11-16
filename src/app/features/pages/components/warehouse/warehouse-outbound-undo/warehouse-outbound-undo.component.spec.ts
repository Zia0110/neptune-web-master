import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WarehouseOutboundUndoComponent } from './warehouse-outbound-undo.component'

describe('WarehouseOutboundUndoComponent', () => {
  let component: WarehouseOutboundUndoComponent
  let fixture: ComponentFixture<WarehouseOutboundUndoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseOutboundUndoComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseOutboundUndoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
