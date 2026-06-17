import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargePrintComponent } from './discharge-print.component';

describe('DischargePrintComponent', () => {
  let component: DischargePrintComponent;
  let fixture: ComponentFixture<DischargePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargePrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
