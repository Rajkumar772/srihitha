import { TestBed } from '@angular/core/testing';

import { LabsServicesService } from './labs-services.service';

describe('LabsServicesService', () => {
  let service: LabsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
