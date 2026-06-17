import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglemeetComponent } from './googlemeet.component';

describe('GooglemeetComponent', () => {
  let component: GooglemeetComponent;
  let fixture: ComponentFixture<GooglemeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GooglemeetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GooglemeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
