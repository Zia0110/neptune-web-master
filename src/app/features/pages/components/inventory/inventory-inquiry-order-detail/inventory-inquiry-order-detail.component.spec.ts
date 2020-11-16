import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InventoryInquiryOrderDetailComponent } from './inventory-inquiry-order-detail.component'

describe('InventoryInquiryOrderDetailComponent', () => {
  let component: InventoryInquiryOrderDetailComponent
  let fixture: ComponentFixture<InventoryInquiryOrderDetailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryInquiryOrderDetailComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryInquiryOrderDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
