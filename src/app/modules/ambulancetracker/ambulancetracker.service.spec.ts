import { TestBed } from '@angular/core/testing';

import { AmbulancetrackerService } from './ambulancetracker.service';

describe('AmbulancetrackerService', () => {
  let service: AmbulancetrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbulancetrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
