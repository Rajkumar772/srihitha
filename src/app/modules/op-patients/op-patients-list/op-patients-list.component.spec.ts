import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpPatientsListComponent } from './op-patients-list.component';

describe('OpPatientsListComponent', () => {
  let component: OpPatientsListComponent;
  let fixture: ComponentFixture<OpPatientsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpPatientsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpPatientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
