import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLabTestsComponent } from './assign-lab-tests.component';

describe('AssignLabTestsComponent', () => {
  let component: AssignLabTestsComponent;
  let fixture: ComponentFixture<AssignLabTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignLabTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignLabTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
