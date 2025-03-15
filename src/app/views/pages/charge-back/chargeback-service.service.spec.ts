import { TestBed } from '@angular/core/testing';

import { ChargebackServiceService } from './chargeback-service.service';

describe('ChargebackServiceService', () => {
  let service: ChargebackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargebackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
