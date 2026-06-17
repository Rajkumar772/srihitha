import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabStockTrackingComponent } from './lab-stock-tracking.component';

describe('LabStockTrackingComponent', () => {
  let component: LabStockTrackingComponent;
  let fixture: ComponentFixture<LabStockTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabStockTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabStockTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
