import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryConsultantComponent } from './primary-consultant.component';

describe('PrimaryConsultantComponent', () => {
  let component: PrimaryConsultantComponent;
  let fixture: ComponentFixture<PrimaryConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryConsultantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
