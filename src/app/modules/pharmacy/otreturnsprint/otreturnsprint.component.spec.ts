import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtreturnsprintComponent } from './otreturnsprint.component';

describe('OtreturnsprintComponent', () => {
  let component: OtreturnsprintComponent;
  let fixture: ComponentFixture<OtreturnsprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtreturnsprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtreturnsprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
