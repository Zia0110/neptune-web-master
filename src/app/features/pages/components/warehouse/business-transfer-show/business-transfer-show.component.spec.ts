import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BusinessTransferShowComponent } from './business-transfer-show.component'

describe('BusinessTransferShowComponent', () => {
  let component: BusinessTransferShowComponent
  let fixture: ComponentFixture<BusinessTransferShowComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTransferShowComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTransferShowComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
