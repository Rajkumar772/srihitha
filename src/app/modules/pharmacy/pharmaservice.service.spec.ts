import { TestBed } from '@angular/core/testing';

import { PharmaserviceService } from './pharmaservice.service';

describe('PharmaserviceService', () => {
  let service: PharmaserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PharmaserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
