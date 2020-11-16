import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientSingleViewSumComponent } from './client-single-view-sum.component'

describe('ClientSingleViewSumComponent', () => {
  let component: ClientSingleViewSumComponent
  let fixture: ComponentFixture<ClientSingleViewSumComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientSingleViewSumComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSingleViewSumComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
