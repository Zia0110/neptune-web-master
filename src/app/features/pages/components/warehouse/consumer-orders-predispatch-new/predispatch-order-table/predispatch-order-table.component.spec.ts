import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PredispatchOrderTableComponent } from './predispatch-order-table.component'

describe('PredispatchOrderTableComponent', () => {
  let component: PredispatchOrderTableComponent
  let fixture: ComponentFixture<PredispatchOrderTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PredispatchOrderTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PredispatchOrderTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
