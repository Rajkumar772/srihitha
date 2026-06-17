import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPrintComponent } from './lab-print.component';

describe('LabPrintComponent', () => {
  let component: LabPrintComponent;
  let fixture: ComponentFixture<LabPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
