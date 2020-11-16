import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DistributionRuleManagementComponent } from './distribution-rule-management.component'

describe('DistributionRuleManagementComponent', () => {
  let component: DistributionRuleManagementComponent
  let fixture: ComponentFixture<DistributionRuleManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionRuleManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionRuleManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
