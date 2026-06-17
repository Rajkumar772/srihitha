import { TestBed } from '@angular/core/testing';

import { CasessheetService } from './casessheet.service';

describe('CasessheetService', () => {
  let service: CasessheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasessheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
