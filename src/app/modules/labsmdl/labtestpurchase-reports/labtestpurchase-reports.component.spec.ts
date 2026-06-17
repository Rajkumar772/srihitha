import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestpurchaseReportsComponent } from './labtestpurchase-reports.component';

describe('LabtestpurchaseReportsComponent', () => {
  let component: LabtestpurchaseReportsComponent;
  let fixture: ComponentFixture<LabtestpurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabtestpurchaseReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabtestpurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
