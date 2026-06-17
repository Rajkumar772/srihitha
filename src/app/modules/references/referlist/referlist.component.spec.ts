import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferlistComponent } from './referlist.component';

describe('ReferlistComponent', () => {
  let component: ReferlistComponent;
  let fixture: ComponentFixture<ReferlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
