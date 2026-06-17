import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardtypeComponent } from './cardtype.component';

describe('CardtypeComponent', () => {
  let component: CardtypeComponent;
  let fixture: ComponentFixture<CardtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
