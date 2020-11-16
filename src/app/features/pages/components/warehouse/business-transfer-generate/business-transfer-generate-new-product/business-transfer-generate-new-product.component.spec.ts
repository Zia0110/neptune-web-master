import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BusinessTransferGenerateNewProductComponent } from './business-transfer-generate-new-product.component'

describe('BusinessTransferGenerateNewProductComponent', () => {
  let component: BusinessTransferGenerateNewProductComponent
  let fixture: ComponentFixture<BusinessTransferGenerateNewProductComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTransferGenerateNewProductComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransferGenerateNewProductComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
