import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestpurchaseitemsComponent } from './labtestpurchaseitems.component';

describe('LabtestpurchaseitemsComponent', () => {
  let component: LabtestpurchaseitemsComponent;
  let fixture: ComponentFixture<LabtestpurchaseitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabtestpurchaseitemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabtestpurchaseitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
