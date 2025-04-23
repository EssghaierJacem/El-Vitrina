import { TestBed } from '@angular/core/testing';

import { ProposalPersoService } from './proposal-perso.service';

describe('ProposalPersoService', () => {
  let service: ProposalPersoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalPersoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
