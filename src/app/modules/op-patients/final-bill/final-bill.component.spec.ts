import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalBillComponent } from './final-bill.component';

describe('FinalBillComponent', () => {
  let component: FinalBillComponent;
  let fixture: ComponentFixture<FinalBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
