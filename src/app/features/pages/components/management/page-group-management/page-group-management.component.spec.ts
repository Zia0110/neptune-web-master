import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageGroupManagementComponent } from './page-group-management.component'

describe('PageGroupManagementComponent', () => {
  let component: PageGroupManagementComponent
  let fixture: ComponentFixture<PageGroupManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageGroupManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGroupManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
