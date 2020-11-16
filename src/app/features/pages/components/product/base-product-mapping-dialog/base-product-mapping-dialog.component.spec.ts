import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BaseProductMappingDialogComponent } from './base-product-mapping-dialog.component'

describe('BaseProductMappingDialogComponent', () => {
  let component: BaseProductMappingDialogComponent
  let fixture: ComponentFixture<BaseProductMappingDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseProductMappingDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseProductMappingDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
