import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InventoryInquiryComponent } from './inventory-inquiry.component'

describe('InventoryInquiryComponent', () => {
  let component: InventoryInquiryComponent
  let fixture: ComponentFixture<InventoryInquiryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryInquiryComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryInquiryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
