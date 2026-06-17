import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorypurchadseComponent } from './inventorypurchadse.component';

describe('InventorypurchadseComponent', () => {
  let component: InventorypurchadseComponent;
  let fixture: ComponentFixture<InventorypurchadseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorypurchadseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorypurchadseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
