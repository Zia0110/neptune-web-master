import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardInventoryViewComponent } from './card-inventory-view.component'

describe('CardInventoryViewComponent', () => {
  let component: CardInventoryViewComponent
  let fixture: ComponentFixture<CardInventoryViewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardInventoryViewComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInventoryViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
