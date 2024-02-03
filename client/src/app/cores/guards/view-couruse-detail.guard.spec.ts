import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { viewCouruseDetailGuard } from './view-couruse-detail.guard';

describe('viewCouruseDetailGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => viewCouruseDetailGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
