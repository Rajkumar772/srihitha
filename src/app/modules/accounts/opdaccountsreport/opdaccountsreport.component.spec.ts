import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdaccountsreportComponent } from './opdaccountsreport.component';

describe('OpdaccountsreportComponent', () => {
  let component: OpdaccountsreportComponent;
  let fixture: ComponentFixture<OpdaccountsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpdaccountsreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdaccountsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
