import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharOverallPrintComponent } from './phar-overall-print.component';

describe('PharOverallPrintComponent', () => {
  let component: PharOverallPrintComponent;
  let fixture: ComponentFixture<PharOverallPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharOverallPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharOverallPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
