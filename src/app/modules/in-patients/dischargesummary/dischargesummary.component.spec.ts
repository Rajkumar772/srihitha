import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargesummaryComponent } from './dischargesummary.component';

describe('DischargesummaryComponent', () => {
  let component: DischargesummaryComponent;
  let fixture: ComponentFixture<DischargesummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargesummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
