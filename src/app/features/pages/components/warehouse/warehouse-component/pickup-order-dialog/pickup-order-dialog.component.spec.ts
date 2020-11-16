import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PickupOrderDialogComponent } from './pickup-order-dialog.component'

describe('PickupOrderDialogComponent', () => {
  let component: PickupOrderDialogComponent
  let fixture: ComponentFixture<PickupOrderDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PickupOrderDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupOrderDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
