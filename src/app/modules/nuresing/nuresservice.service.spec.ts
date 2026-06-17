import { TestBed } from '@angular/core/testing';

import { NuresserviceService } from './nuresservice.service';

describe('NuresserviceService', () => {
  let service: NuresserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuresserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
