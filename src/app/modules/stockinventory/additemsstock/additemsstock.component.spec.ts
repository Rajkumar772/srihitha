import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditemsstockComponent } from './additemsstock.component';

describe('AdditemsstockComponent', () => {
  let component: AdditemsstockComponent;
  let fixture: ComponentFixture<AdditemsstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditemsstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditemsstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
