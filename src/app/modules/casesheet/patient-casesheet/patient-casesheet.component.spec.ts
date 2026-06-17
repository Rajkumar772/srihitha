import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCasesheetComponent } from './patient-casesheet.component';

describe('PatientCasesheetComponent', () => {
  let component: PatientCasesheetComponent;
  let fixture: ComponentFixture<PatientCasesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCasesheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCasesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
