import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPurchaseReportsPrintComponent } from './supplier-purchase-reports-print.component';

describe('SupplierPurchaseReportsPrintComponent', () => {
  let component: SupplierPurchaseReportsPrintComponent;
  let fixture: ComponentFixture<SupplierPurchaseReportsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPurchaseReportsPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPurchaseReportsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
