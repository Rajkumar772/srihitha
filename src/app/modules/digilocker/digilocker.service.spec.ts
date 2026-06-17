import { TestBed } from '@angular/core/testing';

import { DigilockerService } from './digilocker.service';

describe('DigilockerService', () => {
  let service: DigilockerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigilockerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
