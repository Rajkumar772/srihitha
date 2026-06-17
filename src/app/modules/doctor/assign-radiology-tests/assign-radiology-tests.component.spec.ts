import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRadiologyTestsComponent } from './assign-radiology-tests.component';

describe('AssignRadiologyTestsComponent', () => {
  let component: AssignRadiologyTestsComponent;
  let fixture: ComponentFixture<AssignRadiologyTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRadiologyTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRadiologyTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
