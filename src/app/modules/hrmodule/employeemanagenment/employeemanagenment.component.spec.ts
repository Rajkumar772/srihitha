import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeemanagenmentComponent } from './employeemanagenment.component';

describe('EmployeemanagenmentComponent', () => {
  let component: EmployeemanagenmentComponent;
  let fixture: ComponentFixture<EmployeemanagenmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeemanagenmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeemanagenmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
