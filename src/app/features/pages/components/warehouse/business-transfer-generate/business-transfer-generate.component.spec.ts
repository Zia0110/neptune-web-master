import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BusinessTransferGenerateComponent } from './business-transfer-generate.component'

describe('BusinessTransferGenerateComponent', () => {
  let component: BusinessTransferGenerateComponent
  let fixture: ComponentFixture<BusinessTransferGenerateComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTransferGenerateComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransferGenerateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
