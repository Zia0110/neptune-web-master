import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ConsumerOrdersPredispatchStatusFiveComponent } from './consumer-orders-predispatch-status-five.component'

describe('ConsumerOrdersPredispatchStatusFiveComponent', () => {
  let component: ConsumerOrdersPredispatchStatusFiveComponent
  let fixture: ComponentFixture<ConsumerOrdersPredispatchStatusFiveComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerOrdersPredispatchStatusFiveComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerOrdersPredispatchStatusFiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
