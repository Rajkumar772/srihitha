import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsInvestigationHandoffComponent } from './charts-investigation-handoff.component';

describe('ChartsInvestigationHandoffComponent', () => {
  let component: ChartsInvestigationHandoffComponent;
  let fixture: ComponentFixture<ChartsInvestigationHandoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsInvestigationHandoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsInvestigationHandoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
