import { TestBed } from '@angular/core/testing';

import { ActionstatusesService } from './actionstatuses.service';

describe('ActionstatusesService', () => {
  let service: ActionstatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionstatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
