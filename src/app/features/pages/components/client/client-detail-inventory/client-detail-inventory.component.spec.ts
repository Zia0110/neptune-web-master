import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientDetailInventoryComponent } from './client-detail-inventory.component'

describe('ClientDetailInventoryComponent', () => {
  let component: ClientDetailInventoryComponent
  let fixture: ComponentFixture<ClientDetailInventoryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDetailInventoryComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDetailInventoryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
