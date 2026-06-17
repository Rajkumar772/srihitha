import { TestBed } from '@angular/core/testing';

import { AssetserviceService } from './assetservice.service';

describe('AssetserviceService', () => {
  let service: AssetserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
