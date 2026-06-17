import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformLabTestsComponent } from './perform-lab-tests.component';

describe('PerformLabTestsComponent', () => {
  let component: PerformLabTestsComponent;
  let fixture: ComponentFixture<PerformLabTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformLabTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformLabTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
