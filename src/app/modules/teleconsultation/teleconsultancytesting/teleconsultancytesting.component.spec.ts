import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultancytestingComponent } from './teleconsultancytesting.component';

describe('TeleconsultancytestingComponent', () => {
  let component: TeleconsultancytestingComponent;
  let fixture: ComponentFixture<TeleconsultancytestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeleconsultancytestingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultancytestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
