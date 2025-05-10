import { TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdService } from './ad.service';

describe('AdService', () => {
  let service: AdService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]});
    service = TestBed.inject(AdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
