import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsreportComponent } from './labsreport.component';

describe('LabsreportComponent', () => {
  let component: LabsreportComponent;
  let fixture: ComponentFixture<LabsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabsreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
