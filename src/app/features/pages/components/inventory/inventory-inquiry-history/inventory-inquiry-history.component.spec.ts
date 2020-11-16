import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InventoryInquiryHistoryComponent } from './inventory-inquiry-history.component'

describe('InventoryInquiryHistoryComponent', () => {
  let component: InventoryInquiryHistoryComponent
  let fixture: ComponentFixture<InventoryInquiryHistoryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryInquiryHistoryComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryInquiryHistoryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
