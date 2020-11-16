import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailSingleViewPiechartComponent } from './client-detail-single-view-piechart.component'

describe('ClientDetailSingleViewPiechartComponent', () => {
  let component: ClientDetailSingleViewPiechartComponent
  let fixture: ComponentFixture<ClientDetailSingleViewPiechartComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailSingleViewPiechartComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailSingleViewPiechartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
