import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiagnosticTestsComponent } from './add-diagnostic-tests.component';

describe('AddDiagnosticTestsComponent', () => {
  let component: AddDiagnosticTestsComponent;
  let fixture: ComponentFixture<AddDiagnosticTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiagnosticTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiagnosticTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
