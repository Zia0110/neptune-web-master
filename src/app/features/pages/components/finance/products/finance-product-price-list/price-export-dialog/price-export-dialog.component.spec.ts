import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PriceExportDialogComponent } from './price-export-dialog.component'

describe('PriceExportDialogComponent', () => {
  let component: PriceExportDialogComponent
  let fixture: ComponentFixture<PriceExportDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PriceExportDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceExportDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
