import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMedicinePrintComponent } from './doc-medicine-print.component';

describe('DocMedicinePrintComponent', () => {
  let component: DocMedicinePrintComponent;
  let fixture: ComponentFixture<DocMedicinePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocMedicinePrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocMedicinePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
