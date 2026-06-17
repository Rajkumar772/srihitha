import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabGrouptestsComponent } from './lab-grouptests.component';

describe('LabGrouptestsComponent', () => {
  let component: LabGrouptestsComponent;
  let fixture: ComponentFixture<LabGrouptestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabGrouptestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabGrouptestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
