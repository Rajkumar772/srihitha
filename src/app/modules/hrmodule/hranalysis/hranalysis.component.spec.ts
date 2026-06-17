import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HranalysisComponent } from './hranalysis.component';

describe('HranalysisComponent', () => {
  let component: HranalysisComponent;
  let fixture: ComponentFixture<HranalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HranalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HranalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
