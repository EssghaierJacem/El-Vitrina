import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OfferEditComponent } from './offer-edit.component';

describe('OfferEditComponent', () => {
  let component: OfferEditComponent;
  let fixture: ComponentFixture<OfferEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [OfferEditComponent, HttpClientTestingModule, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(OfferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
