import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WarehouseConfirmationComponent } from './warehouse-confirmation.component'

describe('WarehouseConfirmationComponent', () => {
  let component: WarehouseConfirmationComponent
  let fixture: ComponentFixture<WarehouseConfirmationComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseConfirmationComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseConfirmationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
