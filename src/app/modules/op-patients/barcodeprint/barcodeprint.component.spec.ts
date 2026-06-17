import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeprintComponent } from './barcodeprint.component';

describe('BarcodeprintComponent', () => {
  let component: BarcodeprintComponent;
  let fixture: ComponentFixture<BarcodeprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
