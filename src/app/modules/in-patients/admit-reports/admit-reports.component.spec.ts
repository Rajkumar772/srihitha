import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitReportsComponent } from './admit-reports.component';

describe('AdmitReportsComponent', () => {
  let component: AdmitReportsComponent;
  let fixture: ComponentFixture<AdmitReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmitReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
