import { TestBed } from '@angular/core/testing';

import { ReferserviceService } from './referservice.service';

describe('ReferserviceService', () => {
  let service: ReferserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
