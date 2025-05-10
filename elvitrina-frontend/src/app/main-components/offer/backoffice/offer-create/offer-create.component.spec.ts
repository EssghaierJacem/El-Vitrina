import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { OfferCreateComponent } from './offer-create.component';

describe('OfferCreateComponent', () => {
  let component: OfferCreateComponent;
  let fixture: ComponentFixture<OfferCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [OfferCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(OfferCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
