import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WholesaleOrderDialogComponent } from './wholesale-order-dialog.component'

describe('WholesaleOrderDialogComponent', () => {
  let component: WholesaleOrderDialogComponent
  let fixture: ComponentFixture<WholesaleOrderDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WholesaleOrderDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WholesaleOrderDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
