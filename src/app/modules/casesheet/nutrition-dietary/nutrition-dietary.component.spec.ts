import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionDietaryComponent } from './nutrition-dietary.component';

describe('NutritionDietaryComponent', () => {
  let component: NutritionDietaryComponent;
  let fixture: ComponentFixture<NutritionDietaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionDietaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionDietaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
