import { TestBed } from '@angular/core/testing';

import { ReconServiceService } from './recon-service.service';

describe('ReconServiceService', () => {
  let service: ReconServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
