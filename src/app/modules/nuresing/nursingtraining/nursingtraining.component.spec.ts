import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingtrainingComponent } from './nursingtraining.component';

describe('NursingtrainingComponent', () => {
  let component: NursingtrainingComponent;
  let fixture: ComponentFixture<NursingtrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursingtrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingtrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
