import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardWarehouseComponent } from './card-warehouse.component'

describe('CardWarehouseComponent', () => {
  let component: CardWarehouseComponent
  let fixture: ComponentFixture<CardWarehouseComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardWarehouseComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWarehouseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
