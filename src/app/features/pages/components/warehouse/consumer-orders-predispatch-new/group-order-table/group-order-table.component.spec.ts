import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GroupOrderTableComponent } from './group-order-table.component'

describe('GroupOrderTableComponent', () => {
  let component: GroupOrderTableComponent
  let fixture: ComponentFixture<GroupOrderTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupOrderTableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupOrderTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
