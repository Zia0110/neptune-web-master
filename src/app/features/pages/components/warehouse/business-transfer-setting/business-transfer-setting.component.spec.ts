import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BusinessTransferSettingComponent } from './business-transfer-setting.component'

describe('BusinessTransferSettingComponent', () => {
  let component: BusinessTransferSettingComponent
  let fixture: ComponentFixture<BusinessTransferSettingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTransferSettingComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransferSettingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
