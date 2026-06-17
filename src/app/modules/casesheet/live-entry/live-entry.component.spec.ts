import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveEntryComponent } from './live-entry.component';

describe('LiveEntryComponent', () => {
  let component: LiveEntryComponent;
  let fixture: ComponentFixture<LiveEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
