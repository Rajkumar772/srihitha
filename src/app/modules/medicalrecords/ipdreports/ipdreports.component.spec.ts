import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdreportsComponent } from './ipdreports.component';

describe('IpdreportsComponent', () => {
  let component: IpdreportsComponent;
  let fixture: ComponentFixture<IpdreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpdreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpdreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
