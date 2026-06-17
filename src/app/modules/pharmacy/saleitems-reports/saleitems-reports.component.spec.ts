import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleitemsReportsComponent } from './saleitems-reports.component';

describe('SaleitemsReportsComponent', () => {
  let component: SaleitemsReportsComponent;
  let fixture: ComponentFixture<SaleitemsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleitemsReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleitemsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
