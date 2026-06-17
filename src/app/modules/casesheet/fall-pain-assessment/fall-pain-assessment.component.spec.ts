import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallPainAssessmentComponent } from './fall-pain-assessment.component';

describe('FallPainAssessmentComponent', () => {
  let component: FallPainAssessmentComponent;
  let fixture: ComponentFixture<FallPainAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FallPainAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FallPainAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
