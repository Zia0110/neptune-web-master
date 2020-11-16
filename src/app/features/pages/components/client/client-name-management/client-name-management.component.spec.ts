import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientNameManagementComponent } from './client-name-management.component'

describe('ClientNameManagementComponent', () => {
  let component: ClientNameManagementComponent
  let fixture: ComponentFixture<ClientNameManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientNameManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNameManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
