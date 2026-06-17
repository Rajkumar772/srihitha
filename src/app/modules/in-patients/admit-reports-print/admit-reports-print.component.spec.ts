import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitReportsPrintComponent } from './admit-reports-print.component';

describe('AdmitReportsPrintComponent', () => {
  let component: AdmitReportsPrintComponent;
  let fixture: ComponentFixture<AdmitReportsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmitReportsPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitReportsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
