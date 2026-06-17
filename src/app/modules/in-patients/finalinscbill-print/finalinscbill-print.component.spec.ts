import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalinscbillPrintComponent } from './finalinscbill-print.component';

describe('FinalinscbillPrintComponent', () => {
  let component: FinalinscbillPrintComponent;
  let fixture: ComponentFixture<FinalinscbillPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalinscbillPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalinscbillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
