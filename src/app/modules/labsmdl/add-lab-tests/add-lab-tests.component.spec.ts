import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabTestsComponent } from './add-lab-tests.component';

describe('AddLabTestsComponent', () => {
  let component: AddLabTestsComponent;
  let fixture: ComponentFixture<AddLabTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLabTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLabTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
