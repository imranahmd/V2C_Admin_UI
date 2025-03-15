import { TestBed } from '@angular/core/testing';

import { ReconManagementService } from './recon-management.service';

describe('ReconManagementService', () => {
  let service: ReconManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
