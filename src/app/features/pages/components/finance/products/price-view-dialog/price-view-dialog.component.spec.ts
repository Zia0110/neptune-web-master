import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PriceViewDialogComponent } from './price-view-dialog.component'

describe('PriceViewDialogComponent', () => {
  let component: PriceViewDialogComponent
  let fixture: ComponentFixture<PriceViewDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PriceViewDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceViewDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
