import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WholesaleUpdateCommentDialogComponent } from './wholesale-update-comment-dialog.component'

describe('WholesaleUpdateCommentDialogComponent', () => {
  let component: WholesaleUpdateCommentDialogComponent
  let fixture: ComponentFixture<WholesaleUpdateCommentDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WholesaleUpdateCommentDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WholesaleUpdateCommentDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
