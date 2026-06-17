import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireandsafetyComponent } from './fireandsafety.component';

describe('FireandsafetyComponent', () => {
  let component: FireandsafetyComponent;
  let fixture: ComponentFixture<FireandsafetyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FireandsafetyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FireandsafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
