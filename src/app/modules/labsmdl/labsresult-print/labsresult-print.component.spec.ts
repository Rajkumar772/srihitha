import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsresultPrintComponent } from './labsresult-print.component';

describe('LabsresultPrintComponent', () => {
  let component: LabsresultPrintComponent;
  let fixture: ComponentFixture<LabsresultPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabsresultPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsresultPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
