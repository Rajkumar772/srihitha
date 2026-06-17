import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsAnalysisComponent } from './labs-analysis.component';

describe('LabsAnalysisComponent', () => {
  let component: LabsAnalysisComponent;
  let fixture: ComponentFixture<LabsAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabsAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
