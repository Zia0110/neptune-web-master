import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductNameManagementComponent } from './product-name-management.component'

describe('ProductNameManagementComponent', () => {
  let component: ProductNameManagementComponent
  let fixture: ComponentFixture<ProductNameManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductNameManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNameManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
