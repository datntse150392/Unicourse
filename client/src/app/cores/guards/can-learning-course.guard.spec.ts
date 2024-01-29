import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canLearningCourseGuard } from './can-learning-course.guard';

describe('canLearningCourseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canLearningCourseGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
