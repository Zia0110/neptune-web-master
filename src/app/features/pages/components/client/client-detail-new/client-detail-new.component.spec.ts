import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailNewComponent } from './client-detail-new.component'

describe('ClientDetailNewComponent', () => {
  let component: ClientDetailNewComponent
  let fixture: ComponentFixture<ClientDetailNewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailNewComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
