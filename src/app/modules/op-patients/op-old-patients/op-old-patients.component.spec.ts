import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpOldPatientsComponent } from './op-old-patients.component';

describe('OpOldPatientsComponent', () => {
  let component: OpOldPatientsComponent;
  let fixture: ComponentFixture<OpOldPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpOldPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpOldPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
