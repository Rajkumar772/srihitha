import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefhospitalcountsComponent } from './refhospitalcounts.component';

describe('RefhospitalcountsComponent', () => {
  let component: RefhospitalcountsComponent;
  let fixture: ComponentFixture<RefhospitalcountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefhospitalcountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefhospitalcountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
