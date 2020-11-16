import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DistributionRuleDialogComponent } from './distribution-rule-dialog.component'

describe('DistributionRuleDialogComponent', () => {
  let component: DistributionRuleDialogComponent
  let fixture: ComponentFixture<DistributionRuleDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionRuleDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionRuleDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
