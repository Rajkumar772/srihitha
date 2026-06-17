import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalPrintComponent } from './vital-print.component';

describe('VitalPrintComponent', () => {
  let component: VitalPrintComponent;
  let fixture: ComponentFixture<VitalPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitalPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
