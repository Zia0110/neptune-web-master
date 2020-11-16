import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WholesaleOrderTableComponent } from './wholesale-order-table.component'

describe('WholesaleOrderTableComponent', () => {
  let component: WholesaleOrderTableComponent
  let fixture: ComponentFixture<WholesaleOrderTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WholesaleOrderTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WholesaleOrderTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
