import { TestBed } from '@angular/core/testing';

import { ErrorCatchingService } from './error-catching.service';

describe('ErrorCatchingService', () => {
  let service: ErrorCatchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorCatchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
