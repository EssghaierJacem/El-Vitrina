import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { OfferDetailsComponent } from './offer-details.component';

describe('OfferDetailsComponent', () => {
  let component: OfferDetailsComponent;
  let fixture: ComponentFixture<OfferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [OfferDetailsComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(OfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
