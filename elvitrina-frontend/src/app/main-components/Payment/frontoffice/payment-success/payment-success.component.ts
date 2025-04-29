import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';
import { Payment} from  'src/app/core/models/Panier/payment'
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from 'src/app/core/services/user/UserService';
import { TokenService } from 'src/app/core/services/user/TokenService';
@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  payment: Payment;

  currentUser: { id: number; name: string; email: string } = { id: 0, name: '', email: '' };

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const paymentId = localStorage.getItem("lastPaymentId");
    if (paymentId) {
      this.paymentService.updateStatusToSuccess(+paymentId).subscribe({
        next: (updatedPayment) => {
          this.payment = updatedPayment;
        },
        error: err => console.error("Erreur mise à jour statut", err)
      });
    }

    this.loadCurrentUser(); // 👈 Charger l'utilisateur connecté
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
  generateInvoice(): void {
    const element = document.createElement('div');
    element.innerHTML = `
      <h1 style="color: green;">Facture de Paiement</h1>
      <p><strong>ID :</strong> ${this.payment.id}</p>
      <p><strong>Montant :</strong> ${this.payment.amount} EUR</p>
      <p><strong>Méthode :</strong> ${this.payment.method}</p>
      <p><strong>Statut :</strong> ${this.payment.paystatus}</p>
    `;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`facture-paiement-${this.payment.id}.pdf`);
    });
  }
}
