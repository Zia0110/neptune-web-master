import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BusinessTransferChangeWarehouseListComponent } from './business-transfer-change-warehouse-list.component'

describe('BusinessTransferChangeWarehouseListComponent', () => {
  let component: BusinessTransferChangeWarehouseListComponent
  let fixture: ComponentFixture<BusinessTransferChangeWarehouseListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTransferChangeWarehouseListComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransferChangeWarehouseListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
