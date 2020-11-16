import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailSingleViewComponent } from './client-detail-single-view.component'

describe('ClientDetailSingleViewComponent', () => {
  let component: ClientDetailSingleViewComponent
  let fixture: ComponentFixture<ClientDetailSingleViewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailSingleViewComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailSingleViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
