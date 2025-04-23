import { TestBed } from '@angular/core/testing';

import { RequestPersoService } from './request-perso.service';

describe('RequestPersoService', () => {
  let service: RequestPersoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestPersoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
