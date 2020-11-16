import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BatchCancelDialogComponent } from './batch-cancel-dialog.component'

describe('BatchCancelDialogComponent', () => {
  let component: BatchCancelDialogComponent
  let fixture: ComponentFixture<BatchCancelDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BatchCancelDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCancelDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
