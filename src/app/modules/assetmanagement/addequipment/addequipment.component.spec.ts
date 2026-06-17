import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddequipmentComponent } from './addequipment.component';

describe('AddequipmentComponent', () => {
  let component: AddequipmentComponent;
  let fixture: ComponentFixture<AddequipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddequipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddequipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
