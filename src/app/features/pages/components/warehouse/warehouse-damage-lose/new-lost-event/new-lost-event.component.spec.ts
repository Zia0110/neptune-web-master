import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NewLostEventComponent } from './new-lost-event.component'

describe('NewLostEventComponent', () => {
  let component: NewLostEventComponent
  let fixture: ComponentFixture<NewLostEventComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewLostEventComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLostEventComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
