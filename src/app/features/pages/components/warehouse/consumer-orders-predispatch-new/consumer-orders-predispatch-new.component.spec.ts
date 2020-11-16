import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ConsumerOrdersPredispatchNewComponent } from './consumer-orders-predispatch-new.component'

describe('ConsumerOrdersPredispatchNewComponent', () => {
  let component: ConsumerOrdersPredispatchNewComponent
  let fixture: ComponentFixture<ConsumerOrdersPredispatchNewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerOrdersPredispatchNewComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerOrdersPredispatchNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
