import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrdDataComponent } from './mrd-data.component';

describe('MrdDataComponent', () => {
  let component: MrdDataComponent;
  let fixture: ComponentFixture<MrdDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrdDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrdDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
