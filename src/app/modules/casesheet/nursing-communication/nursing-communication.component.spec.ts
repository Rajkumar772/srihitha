import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingCommunicationComponent } from './nursing-communication.component';

describe('NursingCommunicationComponent', () => {
  let component: NursingCommunicationComponent;
  let fixture: ComponentFixture<NursingCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursingCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
