import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BulkCommentsModifyDialogComponent } from './bulk-comments-modify-dialog.component'

describe('BulkCommentsModifyDialogComponent', () => {
  let component: BulkCommentsModifyDialogComponent
  let fixture: ComponentFixture<BulkCommentsModifyDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkCommentsModifyDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCommentsModifyDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
