import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentViewComponent } from './payment-view.component';

describe('PaymentViewComponent', () => {
  let component: PaymentViewComponent;
  let fixture: ComponentFixture<PaymentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
