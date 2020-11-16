import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TransferApplicationDialogComponent } from './transfer-application-dialog.component'

describe('TransferApplicationDialogComponent', () => {
  let component: TransferApplicationDialogComponent
  let fixture: ComponentFixture<TransferApplicationDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferApplicationDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferApplicationDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
