import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NameManagementTableComponent } from './name-management-table.component'

describe('NameManagementTableComponent', () => {
  let component: NameManagementTableComponent
  let fixture: ComponentFixture<NameManagementTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NameManagementTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NameManagementTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
