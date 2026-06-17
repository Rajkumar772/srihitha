import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestitemsComponent } from './labtestitems.component';

describe('LabtestitemsComponent', () => {
  let component: LabtestitemsComponent;
  let fixture: ComponentFixture<LabtestitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabtestitemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabtestitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
