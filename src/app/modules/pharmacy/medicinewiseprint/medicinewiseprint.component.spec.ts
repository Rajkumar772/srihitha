import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinewiseprintComponent } from './medicinewiseprint.component';

describe('MedicinewiseprintComponent', () => {
  let component: MedicinewiseprintComponent;
  let fixture: ComponentFixture<MedicinewiseprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicinewiseprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicinewiseprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
