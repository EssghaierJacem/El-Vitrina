import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCreatefroComponent } from './payment-createfro.component';

describe('PaymentCreatefroComponent', () => {
  let component: PaymentCreatefroComponent;
  let fixture: ComponentFixture<PaymentCreatefroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCreatefroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCreatefroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
