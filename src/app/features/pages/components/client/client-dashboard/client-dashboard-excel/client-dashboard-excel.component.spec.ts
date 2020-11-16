import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDashboardExcelComponent } from './client-dashboard-excel.component'

describe('ClientDashboardExcelComponent', () => {
  let component: ClientDashboardExcelComponent
  let fixture: ComponentFixture<ClientDashboardExcelComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDashboardExcelComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDashboardExcelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
