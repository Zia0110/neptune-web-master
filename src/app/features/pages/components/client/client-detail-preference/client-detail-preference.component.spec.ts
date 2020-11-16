import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailPreferenceComponent } from './client-detail-preference.component'

describe('ClientDetailPreferenceComponent', () => {
  let component: ClientDetailPreferenceComponent
  let fixture: ComponentFixture<ClientDetailPreferenceComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailPreferenceComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailPreferenceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
