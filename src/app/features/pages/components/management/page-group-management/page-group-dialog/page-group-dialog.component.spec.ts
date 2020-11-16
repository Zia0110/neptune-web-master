import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageGroupDialogComponent } from './page-group-dialog.component'

describe('PageGroupDialogComponent', () => {
  let component: PageGroupDialogComponent
  let fixture: ComponentFixture<PageGroupDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageGroupDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGroupDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
