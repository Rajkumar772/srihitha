import { TestBed } from '@angular/core/testing';
import { GoogleMeetService } from './googlemeet.service';


describe('GooglemeetService', () => {
  let service: GoogleMeetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMeetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
