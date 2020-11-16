import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FinancePurchaseCreateTableComponent } from './finance-purchase-create-table.component'

describe('FinancePurchaseCreateTableComponent', () => {
  let component: FinancePurchaseCreateTableComponent
  let fixture: ComponentFixture<FinancePurchaseCreateTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinancePurchaseCreateTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancePurchaseCreateTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
