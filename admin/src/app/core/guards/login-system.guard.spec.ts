import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginSystemGuard } from './login-system.guard';

describe('loginSystemGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginSystemGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
