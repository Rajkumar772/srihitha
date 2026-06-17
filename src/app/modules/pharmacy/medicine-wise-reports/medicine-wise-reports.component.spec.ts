import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineWiseReportsComponent } from './medicine-wise-reports.component';

describe('MedicineWiseReportsComponent', () => {
  let component: MedicineWiseReportsComponent;
  let fixture: ComponentFixture<MedicineWiseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineWiseReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineWiseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
