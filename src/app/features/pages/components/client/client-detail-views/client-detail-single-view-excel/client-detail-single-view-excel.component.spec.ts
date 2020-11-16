import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailSingleViewExcelComponent } from './client-detail-single-view-excel.component'

describe('ClientDetailSingleViewExcelComponent', () => {
  let component: ClientDetailSingleViewExcelComponent
  let fixture: ComponentFixture<ClientDetailSingleViewExcelComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailSingleViewExcelComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailSingleViewExcelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
