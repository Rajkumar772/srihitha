import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionreportComponent } from './prescriptionreport.component';

describe('PrescriptionreportComponent', () => {
  let component: PrescriptionreportComponent;
  let fixture: ComponentFixture<PrescriptionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
