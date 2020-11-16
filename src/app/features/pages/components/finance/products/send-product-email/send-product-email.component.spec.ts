/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { SendProductEmailComponent } from './send-product-email.component'

describe('SendProductEmailComponent', () => {
  let component: SendProductEmailComponent
  let fixture: ComponentFixture<SendProductEmailComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendProductEmailComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SendProductEmailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
