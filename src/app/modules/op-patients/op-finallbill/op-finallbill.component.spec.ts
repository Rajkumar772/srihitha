import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpFinallbillComponent } from './op-finallbill.component';

describe('OpFinallbillComponent', () => {
  let component: OpFinallbillComponent;
  let fixture: ComponentFixture<OpFinallbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpFinallbillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpFinallbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
