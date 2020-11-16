import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDashboardDescendingComponent } from './client-dashboard-descending.component'

describe('ClientDashboardDescendingComponent', () => {
  let component: ClientDashboardDescendingComponent
  let fixture: ComponentFixture<ClientDashboardDescendingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDashboardDescendingComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDashboardDescendingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
