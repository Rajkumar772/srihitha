import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddphysiotherapyComponent } from './addphysiotherapy.component';

describe('AddphysiotherapyComponent', () => {
  let component: AddphysiotherapyComponent;
  let fixture: ComponentFixture<AddphysiotherapyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddphysiotherapyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddphysiotherapyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
