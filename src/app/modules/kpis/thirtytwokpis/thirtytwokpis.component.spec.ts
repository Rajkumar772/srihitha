import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirtytwokpisComponent } from './thirtytwokpis.component';

describe('ThirtytwokpisComponent', () => {
  let component: ThirtytwokpisComponent;
  let fixture: ComponentFixture<ThirtytwokpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirtytwokpisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirtytwokpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
