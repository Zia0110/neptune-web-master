import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NameManagementDialogComponent } from './name-management-dialog.component'

describe('NameManagementDialogComponent', () => {
  let component: NameManagementDialogComponent
  let fixture: ComponentFixture<NameManagementDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NameManagementDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NameManagementDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
