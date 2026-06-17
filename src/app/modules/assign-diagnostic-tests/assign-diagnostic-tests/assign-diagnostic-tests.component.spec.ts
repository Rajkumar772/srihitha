import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDiagnosticTestsComponent } from './assign-diagnostic-tests.component';

describe('AssignDiagnosticTestsComponent', () => {
  let component: AssignDiagnosticTestsComponent;
  let fixture: ComponentFixture<AssignDiagnosticTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignDiagnosticTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDiagnosticTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
