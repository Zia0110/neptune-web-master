import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageManagementDialogComponent } from './page-management-dialog.component'

describe('PageManagementDialogComponent', () => {
  let component: PageManagementDialogComponent
  let fixture: ComponentFixture<PageManagementDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageManagementDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageManagementDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
