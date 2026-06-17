import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceduresReportsPrintComponent } from './procedures-reports-print.component';

describe('ProceduresReportsPrintComponent', () => {
  let component: ProceduresReportsPrintComponent;
  let fixture: ComponentFixture<ProceduresReportsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceduresReportsPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceduresReportsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
