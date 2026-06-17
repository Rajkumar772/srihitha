import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingshiftsComponent } from './addingshifts.component';

describe('AddingshiftsComponent', () => {
  let component: AddingshiftsComponent;
  let fixture: ComponentFixture<AddingshiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingshiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
