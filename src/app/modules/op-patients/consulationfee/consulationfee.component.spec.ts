import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulationfeeComponent } from './consulationfee.component';

describe('ConsulationfeeComponent', () => {
  let component: ConsulationfeeComponent;
  let fixture: ComponentFixture<ConsulationfeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsulationfeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulationfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
