import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NameManagementComponent } from './name-management.component'

describe('NameManagementComponent', () => {
  let component: NameManagementComponent
  let fixture: ComponentFixture<NameManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NameManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NameManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
