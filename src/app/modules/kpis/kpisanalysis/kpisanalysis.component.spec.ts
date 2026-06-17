import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisanalysisComponent } from './kpisanalysis.component';

describe('KpisanalysisComponent', () => {
  let component: KpisanalysisComponent;
  let fixture: ComponentFixture<KpisanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpisanalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
