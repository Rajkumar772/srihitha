import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReportPrintComponent } from './audit-report-print.component';

describe('AuditReportPrintComponent', () => {
  let component: AuditReportPrintComponent;
  let fixture: ComponentFixture<AuditReportPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditReportPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
