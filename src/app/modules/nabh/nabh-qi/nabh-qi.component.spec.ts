import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NabhQiComponent } from './nabh-qi.component';

describe('NabhQiComponent', () => {
  let component: NabhQiComponent;
  let fixture: ComponentFixture<NabhQiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NabhQiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NabhQiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
