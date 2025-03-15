import { TestBed } from '@angular/core/testing';

import { PayoutSettlementService } from './payout-settlement.service';

describe('PayoutSettlementService', () => {
  let service: PayoutSettlementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayoutSettlementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
