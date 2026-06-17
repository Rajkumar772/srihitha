import { TestBed } from '@angular/core/testing';

import { HrmoduleserviceService } from './hrmoduleservice.service';

describe('HrmoduleserviceService', () => {
  let service: HrmoduleserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrmoduleserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
