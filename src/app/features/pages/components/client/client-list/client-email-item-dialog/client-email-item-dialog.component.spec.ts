import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientEmailItemDialogComponent } from './client-email-item-dialog.component'

describe('ClientEmailItemDialogComponent', () => {
  let component: ClientEmailItemDialogComponent
  let fixture: ComponentFixture<ClientEmailItemDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientEmailItemDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEmailItemDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
