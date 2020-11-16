import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RuleCommentFromTextComponent } from './rule-comment-from-text.component'

describe('RuleCommentFromTextComponent', () => {
  let component: RuleCommentFromTextComponent
  let fixture: ComponentFixture<RuleCommentFromTextComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RuleCommentFromTextComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleCommentFromTextComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
