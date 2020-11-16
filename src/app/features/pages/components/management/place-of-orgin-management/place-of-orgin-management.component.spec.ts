import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PlaceOfOrginManagementComponent } from './place-of-orgin-management.component'

describe('PlaceOfOrginManagementComponent', () => {
  let component: PlaceOfOrginManagementComponent
  let fixture: ComponentFixture<PlaceOfOrginManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceOfOrginManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceOfOrginManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
