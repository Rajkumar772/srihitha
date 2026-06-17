import { TestBed } from '@angular/core/testing';

import { VendorserviceService } from './vendorservice.service';

describe('VendorserviceService', () => {
  let service: VendorserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
