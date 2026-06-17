import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtreturnitemslistprintComponent } from './otreturnitemslistprint.component';

describe('OtreturnitemslistprintComponent', () => {
  let component: OtreturnitemslistprintComponent;
  let fixture: ComponentFixture<OtreturnitemslistprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtreturnitemslistprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtreturnitemslistprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
