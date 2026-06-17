import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockdrillComponent } from './mockdrill.component';

describe('MockdrillComponent', () => {
  let component: MockdrillComponent;
  let fixture: ComponentFixture<MockdrillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockdrillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockdrillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
