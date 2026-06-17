import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPerfomaComponent } from './print-perfoma.component';

describe('PrintPerfomaComponent', () => {
  let component: PrintPerfomaComponent;
  let fixture: ComponentFixture<PrintPerfomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPerfomaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPerfomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
