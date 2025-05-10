import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { CheckoutStepperComponent } from './checkout-stepper.component';

describe('CheckoutStepperComponent', () => {
  let component: CheckoutStepperComponent;
  let fixture: ComponentFixture<CheckoutStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [CheckoutStepperComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
