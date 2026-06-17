import { TestBed } from '@angular/core/testing';

import { GstreportssesrviceService } from './gstreportssesrvice.service';

describe('GstreportssesrviceService', () => {
  let service: GstreportssesrviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstreportssesrviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
