import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WholesaleOrderComponent } from './wholesale-order.component'

describe('WholesaleOrderComponent', () => {
  let component: WholesaleOrderComponent
  let fixture: ComponentFixture<WholesaleOrderComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WholesaleOrderComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WholesaleOrderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
