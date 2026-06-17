import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpPrintComponent } from './op-print.component';

describe('OpPrintComponent', () => {
  let component: OpPrintComponent;
  let fixture: ComponentFixture<OpPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
