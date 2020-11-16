import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SingleOrderTableComponent } from './single-order-table.component'

describe('SingleOrderTableComponent', () => {
  let component: SingleOrderTableComponent
  let fixture: ComponentFixture<SingleOrderTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleOrderTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOrderTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
