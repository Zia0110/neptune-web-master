import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ZoomSingleImageComponent } from './zoom-single-image.component'

describe('ZoomSingleImageComponent', () => {
  let component: ZoomSingleImageComponent
  let fixture: ComponentFixture<ZoomSingleImageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZoomSingleImageComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomSingleImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
