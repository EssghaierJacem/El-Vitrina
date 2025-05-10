import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { PaymentViewComponent } from './payment-view.component';

describe('PaymentViewComponent', () => {
  let component: PaymentViewComponent;
  let fixture: ComponentFixture<PaymentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [PaymentViewComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(PaymentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
