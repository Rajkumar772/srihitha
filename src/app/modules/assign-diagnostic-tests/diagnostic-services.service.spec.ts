import { TestBed } from '@angular/core/testing';

import { DiagnosticServicesService } from './diagnostic-services.service';

describe('DiagnosticServicesService', () => {
  let service: DiagnosticServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosticServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
