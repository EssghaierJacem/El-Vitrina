import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment, PaymentStatusType } from 'src/app/core/models/Panier/Payment';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {
  payment!: Payment;
  statusClass = '';

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.paymentService.getPaymentById(id).subscribe({
        next: (data) => {
          this.payment = data;
          this.setStatusClass();
        },
        error: (err) => console.error('Error loading payment:', err)
      });
    }
  }

  private setStatusClass() {
    switch(this.payment.paystatus) {
      case PaymentStatusType.SUCCESS:
        this.statusClass = 'status-completed';
        break;
      case PaymentStatusType.PENDING:
        this.statusClass = 'status-pending';
        break;
      case PaymentStatusType.FAILED:
        this.statusClass = 'status-failed';
        break;
        this.statusClass = 'status-refunded';
        break;
      default:
        this.statusClass = 'status-default';
    }
  }

  navigateToPayments() {
    this.router.navigate(['/payments']);
  }

  getStatusText(status: PaymentStatusType): string {
    return {
      [PaymentStatusType.SUCCESS]: 'Payment successful',
      [PaymentStatusType.PENDING]: 'Pending',
      [PaymentStatusType.FAILED]: 'Failed',
    }[status] || 'Unknown';
  }
}
