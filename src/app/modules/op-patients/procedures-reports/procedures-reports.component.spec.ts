import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceduresReportsComponent } from './procedures-reports.component';

describe('ProceduresReportsComponent', () => {
  let component: ProceduresReportsComponent;
  let fixture: ComponentFixture<ProceduresReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceduresReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceduresReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
