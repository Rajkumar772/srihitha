import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpAnalysisComponent } from './op-analysis.component';

describe('OpAnalysisComponent', () => {
  let component: OpAnalysisComponent;
  let fixture: ComponentFixture<OpAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
