import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ConsumerOrdersPaperComponent } from './consumer-orders-paper.component'

describe('ConsumerOrdersPaperComponent', () => {
  let component: ConsumerOrdersPaperComponent
  let fixture: ComponentFixture<ConsumerOrdersPaperComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerOrdersPaperComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerOrdersPaperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
