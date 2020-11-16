import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TrackingInfoBatchUploadComponent } from './tracking-info-batch-upload.component'

describe('TrackingInfoBatchUploadComponent', () => {
  let component: TrackingInfoBatchUploadComponent
  let fixture: ComponentFixture<TrackingInfoBatchUploadComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingInfoBatchUploadComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingInfoBatchUploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
