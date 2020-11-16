import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PredispatchOrderFiveTableComponent } from './predispatch-order-five-table.component'

describe('PredispatchOrderFiveTableComponent', () => {
  let component: PredispatchOrderFiveTableComponent
  let fixture: ComponentFixture<PredispatchOrderFiveTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PredispatchOrderFiveTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PredispatchOrderFiveTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
