import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetstockComponent } from './assetstock.component';

describe('AssetstockComponent', () => {
  let component: AssetstockComponent;
  let fixture: ComponentFixture<AssetstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
