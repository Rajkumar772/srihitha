import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPurchaseReportsComponent } from './supplier-purchase-reports.component';

describe('SupplierPurchaseReportsComponent', () => {
  let component: SupplierPurchaseReportsComponent;
  let fixture: ComponentFixture<SupplierPurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPurchaseReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
