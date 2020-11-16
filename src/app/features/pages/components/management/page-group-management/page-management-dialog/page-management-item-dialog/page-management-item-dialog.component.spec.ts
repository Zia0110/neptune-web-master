import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageManagementItemDialogComponent } from './page-management-item-dialog.component'

describe('PageManagementItemDialogComponent', () => {
  let component: PageManagementItemDialogComponent
  let fixture: ComponentFixture<PageManagementItemDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageManagementItemDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageManagementItemDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
