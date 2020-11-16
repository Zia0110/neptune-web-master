import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProcessRecordComponent } from './order-ticket-complete-dialog.component'

describe('ProcessRecordComponent', () => {
  let component: ProcessRecordComponent
  let fixture: ComponentFixture<ProcessRecordComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessRecordComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessRecordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
