import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpIpLabGstReportPrintComponent } from './op-ip-lab-gst-report-print.component';

describe('OpIpLabGstReportPrintComponent', () => {
  let component: OpIpLabGstReportPrintComponent;
  let fixture: ComponentFixture<OpIpLabGstReportPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpIpLabGstReportPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpIpLabGstReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
