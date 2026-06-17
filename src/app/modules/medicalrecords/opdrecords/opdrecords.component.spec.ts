import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdrecordsComponent } from './opdrecords.component';

describe('OpdrecordsComponent', () => {
  let component: OpdrecordsComponent;
  let fixture: ComponentFixture<OpdrecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpdrecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
