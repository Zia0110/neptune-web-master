import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NewTicketImageComponent } from './new-ticket-image.component'

describe('NewTicketImageComponent', () => {
  let component: NewTicketImageComponent
  let fixture: ComponentFixture<NewTicketImageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewTicketImageComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTicketImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
