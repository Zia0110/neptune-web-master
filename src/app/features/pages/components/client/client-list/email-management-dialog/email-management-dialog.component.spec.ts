import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EmailManagementDialogComponent } from './email-management-dialog.component'

describe('EmailManagementDialogComponent', () => {
  let component: EmailManagementDialogComponent
  let fixture: ComponentFixture<EmailManagementDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailManagementDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailManagementDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
