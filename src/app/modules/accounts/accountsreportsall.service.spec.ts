import { TestBed } from '@angular/core/testing';

import { AccountsreportsallService } from './accountsreportsall.service';

describe('AccountsreportsallService', () => {
  let service: AccountsreportsallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsreportsallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
