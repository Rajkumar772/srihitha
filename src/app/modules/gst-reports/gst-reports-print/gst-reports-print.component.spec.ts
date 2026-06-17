import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstReportsPrintComponent } from './gst-reports-print.component';

describe('GstReportsPrintComponent', () => {
  let component: GstReportsPrintComponent;
  let fixture: ComponentFixture<GstReportsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstReportsPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GstReportsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
