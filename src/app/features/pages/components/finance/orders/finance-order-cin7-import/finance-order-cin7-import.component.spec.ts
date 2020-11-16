import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FinanceOrderCin7ImportComponent } from './finance-order-cin7-import.component'

describe('FinanceOrderCin7ImportComponent', () => {
  let component: FinanceOrderCin7ImportComponent
  let fixture: ComponentFixture<FinanceOrderCin7ImportComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceOrderCin7ImportComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceOrderCin7ImportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
