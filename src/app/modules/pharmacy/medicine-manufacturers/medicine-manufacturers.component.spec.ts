import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineManufacturersComponent } from './medicine-manufacturers.component';

describe('MedicineManufacturersComponent', () => {
  let component: MedicineManufacturersComponent;
  let fixture: ComponentFixture<MedicineManufacturersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineManufacturersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineManufacturersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
