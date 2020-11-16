import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationConfigurationManagementComponent } from './notification-configuration-management.component'

describe('NotificationConfigurationManagementComponent', () => {
  let component: NotificationConfigurationManagementComponent
  let fixture: ComponentFixture<NotificationConfigurationManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationConfigurationManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationConfigurationManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
