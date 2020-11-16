import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ConsumerOrdersPredispatchComponent } from './consumer-orders-predispatch.component'

describe('ConsumerOrdersPredispatchComponent', () => {
  let component: ConsumerOrdersPredispatchComponent
  let fixture: ComponentFixture<ConsumerOrdersPredispatchComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerOrdersPredispatchComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerOrdersPredispatchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
