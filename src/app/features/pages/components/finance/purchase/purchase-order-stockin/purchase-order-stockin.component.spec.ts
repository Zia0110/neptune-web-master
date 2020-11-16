import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PurchaseOrderStockinComponent } from './purchase-order-stockin.component'

describe('PurchaseOrderStockinComponent', () => {
  let component: PurchaseOrderStockinComponent
  let fixture: ComponentFixture<PurchaseOrderStockinComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseOrderStockinComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderStockinComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
