import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPrintComponent } from './checkout-print.component';

describe('CheckoutPrintComponent', () => {
  let component: CheckoutPrintComponent;
  let fixture: ComponentFixture<CheckoutPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
