import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestsuppliersComponent } from './labtestsuppliers.component';

describe('LabtestsuppliersComponent', () => {
  let component: LabtestsuppliersComponent;
  let fixture: ComponentFixture<LabtestsuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabtestsuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabtestsuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
