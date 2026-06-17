import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPrescComponent } from './doctor-presc.component';

describe('DoctorPrescComponent', () => {
  let component: DoctorPrescComponent;
  let fixture: ComponentFixture<DoctorPrescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorPrescComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorPrescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
