import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintdischargeComponent } from './printdischarge.component';

describe('PrintdischargeComponent', () => {
  let component: PrintdischargeComponent;
  let fixture: ComponentFixture<PrintdischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintdischargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintdischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
