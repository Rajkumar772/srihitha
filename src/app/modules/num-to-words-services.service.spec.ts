import { TestBed } from '@angular/core/testing';

import { NumToWordsServicesService } from './num-to-words-services.service';

describe('NumToWordsServicesService', () => {
  let service: NumToWordsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumToWordsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
