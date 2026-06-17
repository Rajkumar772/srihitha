import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreinventorypurchasereportComponent } from './storeinventorypurchasereport.component';

describe('StoreinventorypurchasereportComponent', () => {
  let component: StoreinventorypurchasereportComponent;
  let fixture: ComponentFixture<StoreinventorypurchasereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreinventorypurchasereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreinventorypurchasereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
