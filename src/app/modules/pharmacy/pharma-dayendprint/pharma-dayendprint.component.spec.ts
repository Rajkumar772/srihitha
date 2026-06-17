import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaDayendprintComponent } from './pharma-dayendprint.component';

describe('PharmaDayendprintComponent', () => {
  let component: PharmaDayendprintComponent;
  let fixture: ComponentFixture<PharmaDayendprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaDayendprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaDayendprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
