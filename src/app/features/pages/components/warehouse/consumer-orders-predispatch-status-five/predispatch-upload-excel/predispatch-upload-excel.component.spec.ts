import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PredispatchUploadExcelComponent } from './predispatch-upload-excel.component'

describe('PredispatchUploadExcelComponent', () => {
  let component: PredispatchUploadExcelComponent
  let fixture: ComponentFixture<PredispatchUploadExcelComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PredispatchUploadExcelComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PredispatchUploadExcelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
