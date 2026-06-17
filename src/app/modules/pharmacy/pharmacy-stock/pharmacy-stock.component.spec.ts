import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyStockComponent } from './pharmacy-stock.component';

describe('PharmacyStockComponent', () => {
  let component: PharmacyStockComponent;
  let fixture: ComponentFixture<PharmacyStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
