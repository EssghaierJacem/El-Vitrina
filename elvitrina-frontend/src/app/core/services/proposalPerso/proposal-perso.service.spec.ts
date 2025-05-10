import { TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProposalPersoService } from './proposal-perso.service';

describe('ProposalPersoService', () => {
  let service: ProposalPersoService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]});
    service = TestBed.inject(ProposalPersoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
