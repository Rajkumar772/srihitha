import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeprintComponent } from './dischargeprint.component';

describe('DischargeprintComponent', () => {
  let component: DischargeprintComponent;
  let fixture: ComponentFixture<DischargeprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargeprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargeprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
