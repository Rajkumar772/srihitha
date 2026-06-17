import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseprintsComponent } from './purchaseprints.component';

describe('PurchaseprintsComponent', () => {
  let component: PurchaseprintsComponent;
  let fixture: ComponentFixture<PurchaseprintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseprintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
