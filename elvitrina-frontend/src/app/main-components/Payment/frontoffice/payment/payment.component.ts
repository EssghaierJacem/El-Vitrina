import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/core/services/Panier/PaymentService';

@Component({
  selector: 'app-payment',
  template: `
    <div class="container">
      <h2>Simple Payment </h2>
      <p>Amount: {{ amountToPay }} DNT</p>  <!-- Diviser par 100 si tu travailles en centimes -->
      <button (click)="pay()">Payer</button>
    </div>
  `
})
export class PaymentComponent implements OnInit {
  amountToPay: number = 0;  // Initialise amountToPay à 0 au départ.

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    // Appel de la méthode pour récupérer le dernier paiement
    this.getLastPaymentAmount();
  }

  // Récupérer le montant du dernier paiement effectué
  getLastPaymentAmount() {
    this.paymentService.getAllPayments().subscribe({
      next: (res) => {
        console.log('Paiements récupérés :', res);

        // Vérifie si des paiements existent
        if (res && res.length > 0) {
          const lastPayment = res[res.length - 1]; // Dernier paiement effectué

          // Vérifie si le montant est valide (doit être un nombre entier et positif)
          if (lastPayment.amount && !isNaN(lastPayment.amount) && lastPayment.amount > 0) {
            console.log('Dernier paiement trouvé :', lastPayment);
            this.amountToPay = lastPayment.amount;  // Assigne le montant du dernier paiement
          } else {
            // Si le montant du dernier paiement est invalide, utiliser une valeur par défaut
            console.warn('Montant invalide dans le dernier paiement, valeur par défaut appliquée');
            this.amountToPay = 12000; // Exemple par défaut (120 DNT)
          }
        } else {
          // Si aucun paiement trouvé, utiliser un montant par défaut
          console.warn('Aucun paiement trouvé, valeur par défaut appliquée');
          this.amountToPay = 12000; // Exemple par défaut (120 DNT)
        }
      },
      error: (err) => {
        // En cas d'erreur lors de la récupération des paiements
        console.error('Erreur lors de la récupération des paiements', err);
        this.amountToPay = 12000; // Valeur par défaut en cas d'erreur
      }
    });
  }

  // Effectuer le paiement
  pay() {
    this.paymentService.createCheckoutSession(this.amountToPay).subscribe({
      next: (res) => {
        if (res.url) {
          window.location.href = res.url; // Redirection vers la page de paiement
        }
      },
      error: (err) => {
        console.error('Erreur Stripe', err);
      }
    });
  }
}
