import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BusinessTransferChangeComponent } from './business-transfer-change.component'

describe('BusinessTransferChangeComponent', () => {
  let component: BusinessTransferChangeComponent
  let fixture: ComponentFixture<BusinessTransferChangeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTransferChangeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransferChangeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
