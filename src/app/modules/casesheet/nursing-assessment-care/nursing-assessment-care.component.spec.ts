import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingAssessmentCareComponent } from './nursing-assessment-care.component';

describe('NursingAssessmentCareComponent', () => {
  let component: NursingAssessmentCareComponent;
  let fixture: ComponentFixture<NursingAssessmentCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursingAssessmentCareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingAssessmentCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
