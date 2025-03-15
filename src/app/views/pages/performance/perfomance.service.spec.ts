import { TestBed } from '@angular/core/testing';

import { PerfomanceService } from './perfomance.service';

describe('PerfomanceService', () => {
  let service: PerfomanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfomanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
