import { TestBed } from '@angular/core/testing';

import { OpServicesService } from './op-services.service';

describe('OpServicesService', () => {
  let service: OpServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
