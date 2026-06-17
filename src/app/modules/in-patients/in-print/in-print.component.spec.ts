import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPrintComponent } from './in-print.component';

describe('InPrintComponent', () => {
  let component: InPrintComponent;
  let fixture: ComponentFixture<InPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
