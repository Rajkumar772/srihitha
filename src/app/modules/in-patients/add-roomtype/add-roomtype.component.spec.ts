import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomtypeComponent } from './add-roomtype.component';

describe('AddRoomtypeComponent', () => {
  let component: AddRoomtypeComponent;
  let fixture: ComponentFixture<AddRoomtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRoomtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoomtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
