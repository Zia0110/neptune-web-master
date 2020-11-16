import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BusinessTransferWarehouseListComponent } from './business-transfer-warehouse-list.component'

describe('BusinessTransferWarehouseListComponent', () => {
  let component: BusinessTransferWarehouseListComponent
  let fixture: ComponentFixture<BusinessTransferWarehouseListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTransferWarehouseListComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransferWarehouseListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
