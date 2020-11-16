import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SelfGoodDialogComponent } from './self-good-dialog.component'

describe('SelfGoodDialogComponent', () => {
  let component: SelfGoodDialogComponent
  let fixture: ComponentFixture<SelfGoodDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelfGoodDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfGoodDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
