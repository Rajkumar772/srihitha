import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerticicateComponent } from './certicicate.component';

describe('CerticicateComponent', () => {
  let component: CerticicateComponent;
  let fixture: ComponentFixture<CerticicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CerticicateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CerticicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
