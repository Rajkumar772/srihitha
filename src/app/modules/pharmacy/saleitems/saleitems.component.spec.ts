import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleitemsComponent } from './saleitems.component';

describe('SaleitemsComponent', () => {
  let component: SaleitemsComponent;
  let fixture: ComponentFixture<SaleitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleitemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
