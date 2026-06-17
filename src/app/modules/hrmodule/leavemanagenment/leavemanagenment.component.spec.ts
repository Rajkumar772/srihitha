import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavemanagenmentComponent } from './leavemanagenment.component';

describe('LeavemanagenmentComponent', () => {
  let component: LeavemanagenmentComponent;
  let fixture: ComponentFixture<LeavemanagenmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavemanagenmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavemanagenmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
