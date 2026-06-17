import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaAnalysisComponent } from './pharma-analysis.component';

describe('PharmaAnalysisComponent', () => {
  let component: PharmaAnalysisComponent;
  let fixture: ComponentFixture<PharmaAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
