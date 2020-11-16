import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TransferWarehouseTransportComponent } from './transfer-warehouse-transport.component'

describe('TransferWarehouseTransportComponent', () => {
  let component: TransferWarehouseTransportComponent
  let fixture: ComponentFixture<TransferWarehouseTransportComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferWarehouseTransportComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferWarehouseTransportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
