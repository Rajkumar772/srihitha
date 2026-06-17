import { TestBed } from '@angular/core/testing';

import { PhysiotherapyserviceService } from './physiotherapyservice.service';

describe('PhysiotherapyserviceService', () => {
  let service: PhysiotherapyserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysiotherapyserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
