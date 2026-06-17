import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreportsPrintComponent } from './salesreports-print.component';

describe('SalesreportsPrintComponent', () => {
  let component: SalesreportsPrintComponent;
  let fixture: ComponentFixture<SalesreportsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesreportsPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreportsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
