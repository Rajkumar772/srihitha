import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceduresReportOverallPrintComponent } from './procedures-report-overall-print.component';

describe('ProceduresReportOverallPrintComponent', () => {
  let component: ProceduresReportOverallPrintComponent;
  let fixture: ComponentFixture<ProceduresReportOverallPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceduresReportOverallPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceduresReportOverallPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
