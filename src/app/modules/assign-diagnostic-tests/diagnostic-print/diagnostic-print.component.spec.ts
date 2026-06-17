import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticPrintComponent } from './diagnostic-print.component';

describe('DiagnosticPrintComponent', () => {
  let component: DiagnosticPrintComponent;
  let fixture: ComponentFixture<DiagnosticPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagnosticPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
