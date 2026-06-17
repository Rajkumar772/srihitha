import { TestBed } from '@angular/core/testing';

import { InPatienrservicesService } from './in-patienrservices.service';

describe('InPatienrservicesService', () => {
  let service: InPatienrservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InPatienrservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
