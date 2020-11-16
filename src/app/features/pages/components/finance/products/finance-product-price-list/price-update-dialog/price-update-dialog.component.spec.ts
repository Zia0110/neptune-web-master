import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PriceUpdateDialogComponent } from './price-update-dialog.component'

describe('PriceUpdateDialogComponent', () => {
  let component: PriceUpdateDialogComponent
  let fixture: ComponentFixture<PriceUpdateDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PriceUpdateDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceUpdateDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
