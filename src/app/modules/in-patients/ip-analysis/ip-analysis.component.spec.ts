import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpAnalysisComponent } from './ip-analysis.component';

describe('IpAnalysisComponent', () => {
  let component: IpAnalysisComponent;
  let fixture: ComponentFixture<IpAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
