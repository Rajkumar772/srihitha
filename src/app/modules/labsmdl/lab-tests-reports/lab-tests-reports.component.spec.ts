import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestsReportsComponent } from './lab-tests-reports.component';

describe('LabTestsReportsComponent', () => {
  let component: LabTestsReportsComponent;
  let fixture: ComponentFixture<LabTestsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabTestsReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTestsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
