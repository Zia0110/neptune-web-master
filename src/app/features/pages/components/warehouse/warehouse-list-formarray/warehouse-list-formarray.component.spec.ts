import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseListFormarrayComponent } from './warehouse-list-formarray.component';

describe('WarehouseListFormarrayComponent', () => {
  let component: WarehouseListFormarrayComponent;
  let fixture: ComponentFixture<WarehouseListFormarrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseListFormarrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseListFormarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
