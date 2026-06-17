import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalbillPrintComponent } from './finalbill-print.component';

describe('FinalbillPrintComponent', () => {
  let component: FinalbillPrintComponent;
  let fixture: ComponentFixture<FinalbillPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalbillPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalbillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
