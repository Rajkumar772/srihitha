import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAllBillsComponent } from './patient-all-bills.component';

describe('PatientAllBillsComponent', () => {
  let component: PatientAllBillsComponent;
  let fixture: ComponentFixture<PatientAllBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAllBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAllBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
