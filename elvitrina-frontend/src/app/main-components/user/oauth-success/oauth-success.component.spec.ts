import { ComponentFixture, TestBed } from '@angular/core/testing';
import {COMMON_TEST_CONFIG, ROUTE_PROVIDERS} from 'src/app/testing/test-utils';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { OauthSuccessComponent } from './oauth-success.component';

describe('OauthSuccessComponent', () => {
  let component: OauthSuccessComponent;
  let fixture: ComponentFixture<OauthSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthSuccessComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
            queryParams: of({token: 'test-token'})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OauthSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
