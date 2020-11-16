import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailTurnoverComponent } from './client-detail-turnover.component'

describe('ClientDetailTurnoverComponent', () => {
  let component: ClientDetailTurnoverComponent
  let fixture: ComponentFixture<ClientDetailTurnoverComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailTurnoverComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailTurnoverComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
