import { TestBed } from '@angular/core/testing';

import { StockinventoryService } from './stockinventory.service';

describe('StockinventoryService', () => {
  let service: StockinventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockinventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
