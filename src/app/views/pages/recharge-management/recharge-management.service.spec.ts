import { TestBed } from '@angular/core/testing';

import { RechargeManagementService } from './recharge-management.service';

describe('RechargeManagementService', () => {
  let service: RechargeManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RechargeManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
