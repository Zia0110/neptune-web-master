import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FinanceCreditImportComponent } from './finance-credit-import.component'

describe('FinanceCreditImportComponent', () => {
  let component: FinanceCreditImportComponent
  let fixture: ComponentFixture<FinanceCreditImportComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceCreditImportComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceCreditImportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
