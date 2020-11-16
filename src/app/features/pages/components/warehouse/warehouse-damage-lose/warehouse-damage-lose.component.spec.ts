import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WarehouseDamageLoseComponent } from './warehouse-damage-lose.component'

describe('WarehouseDamageLoseComponent', () => {
  let component: WarehouseDamageLoseComponent
  let fixture: ComponentFixture<WarehouseDamageLoseComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseDamageLoseComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseDamageLoseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
