import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailDashboardComponent } from './client-detail-dashboard.component'

describe('ClientDetailDashboardComponent', () => {
  let component: ClientDetailDashboardComponent
  let fixture: ComponentFixture<ClientDetailDashboardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailDashboardComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
