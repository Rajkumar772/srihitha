import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdateOpComponent } from './backdate-op.component';

describe('BackdateOpComponent', () => {
  let component: BackdateOpComponent;
  let fixture: ComponentFixture<BackdateOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackdateOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackdateOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
