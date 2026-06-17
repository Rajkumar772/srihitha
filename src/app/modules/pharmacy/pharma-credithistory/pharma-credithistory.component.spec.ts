import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaCredithistoryComponent } from './pharma-credithistory.component';

describe('PharmaCredithistoryComponent', () => {
  let component: PharmaCredithistoryComponent;
  let fixture: ComponentFixture<PharmaCredithistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaCredithistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaCredithistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
