import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { Payment } from 'src/app/core/models/Panier/payment';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, DatePipe],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
  providers: [DatePipe]
})
export class PaymentSuccessComponent implements OnInit {
  payment: Payment;
  isLoading: boolean = true;
  errorMessage: string = '';
  currentDate: string;

  @ViewChild('invoiceElement') invoiceElement: ElementRef;
  @ViewChild('downloadBtn') downloadBtn: ElementRef;
  
  currentUser: { id: number; name: string; email: string } = { id: 0, name: '', email: '' };

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private tokenService: TokenService,
    private datePipe: DatePipe
  ) {
    this.currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadCurrentUser();
    
    this.route.queryParams.subscribe(params => {
      const paymentId = params['paymentId'];
      if (paymentId) {
        this.paymentService.updateStatusToSuccess(+paymentId).subscribe({
          next: (updatedPayment) => {
            this.payment = updatedPayment;
            this.isLoading = false;
          },
          error: err => {
            console.error("Error updating payment status", err);
            this.errorMessage = "Failed to update payment status. Please contact support.";
            this.isLoading = false;
          }
        });
      } else {
        this.errorMessage = "Payment ID not found in URL parameters";
        this.isLoading = false;
      }
    });
  }  

  private loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      const userId = decodedToken.id ?? 0;
      const name = decodedToken.firstname || '';
      const email = decodedToken.email || '';
      this.currentUser = { id: userId, name, email };
    }
  }

  
  // Helper method to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}