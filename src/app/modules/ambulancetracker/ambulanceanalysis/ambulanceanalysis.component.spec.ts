import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceanalysisComponent } from './ambulanceanalysis.component';

describe('AmbulanceanalysisComponent', () => {
  let component: AmbulanceanalysisComponent;
  let fixture: ComponentFixture<AmbulanceanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbulanceanalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
