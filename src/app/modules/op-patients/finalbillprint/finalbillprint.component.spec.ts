import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalbillprintComponent } from './finalbillprint.component';

describe('FinalbillprintComponent', () => {
  let component: FinalbillprintComponent;
  let fixture: ComponentFixture<FinalbillprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalbillprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalbillprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
