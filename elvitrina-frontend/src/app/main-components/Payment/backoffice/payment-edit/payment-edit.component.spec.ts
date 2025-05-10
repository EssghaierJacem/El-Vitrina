import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { PaymentEditComponent } from './payment-edit.component';

describe('PaymentEditComponent', () => {
  let component: PaymentEditComponent;
  let fixture: ComponentFixture<PaymentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [PaymentEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
