import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';

import { loadStripe, Stripe } from '@stripe/stripe-js';

import { PaymentMethodType } from 'src/app/core/models/Panier/PaymentMethodType.type';

import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { PaymentComponent } from '../payment/payment.component';
import { PayementCreationComponent } from '../payement-creation/payement-creation.component';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-checkout-stepper',
  imports: [
    CommonModule,
    PayementCreationComponent,
    PaymentComponent,
    LeafletMapComponent,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './checkout-stepper.component.html',
  styleUrl: './checkout-stepper.component.scss',
})
export class CheckoutStepperComponent implements OnInit {

  // Stripe
  stripe: Stripe | null = null;
  clientSecret: string = '';
  cardElement: any;

  // Formulaires
  personalInfoFormGroup: FormGroup;
  deliveryFormGroup: FormGroup;
  creditCardFormGroup: FormGroup;

  // Méthode de paiement sélectionnée
  selectedPaymentMethod: PaymentMethodType;
  PaymentMethodType = PaymentMethodType; // utilisé dans le HTML

  // Indicateur de création du paiement
  paymentCreated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    // Formulaire pour paiement à la livraison
    this.personalInfoFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      address: ['', Validators.required]
    });

    // Formulaire pour carte bancaire
    this.deliveryFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8}')]]
    });

    // Formulaire Stripe (vide pour Stripe Elements)
    this.creditCardFormGroup = this.fb.group({});
  }

  ngOnInit(): void {
    console.log('✅ CheckoutStepperComponent initialisé');
  }

  totalAmount: number = 100;

  // Mettre à jour l'adresse avec celle sélectionnée sur la carte
  handleMapAddress(address: string): void {
    const targetForm = this.selectedPaymentMethod === PaymentMethodType.CASHONDELIVER
      ? this.personalInfoFormGroup
      : this.deliveryFormGroup;

    targetForm.get('address')?.setValue(address);
  }

  // Callback quand le paiement a été créé dans le composant enfant
  onPaymentCreated(value: boolean): void {
    this.paymentCreated = value;
    console.log('🟢 Paiement marqué comme créé :', value);
  }

  updateTotalAmount(newAmount: number) {
    this.totalAmount = newAmount;
    this.cdr.detectChanges();  // Force la détection des changements
  }

  // Callback quand l’utilisateur change la méthode de paiement
  onPaymentMethodSelected(event: MatRadioChange): void {
    this.selectedPaymentMethod = event.value;  // event.value est de type PaymentMethodType
    console.log(this.selectedPaymentMethod);
  }

  generateInvoicePDF() {
    const doc = new jsPDF();

    // Ajouter un en-tête avec un design amélioré
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Invoice", 105, 20, { align: 'center' });
    // Centrer le titre

    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Ajouter les informations de paiement
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${this.personalInfoFormGroup.value.fullName}`, 20, 40);
    doc.text(`Phone: ${this.personalInfoFormGroup.value.phone}`, 20, 50);
    doc.text(`Email: ${this.personalInfoFormGroup.value.email}`, 20, 60);
    doc.text(`Address: ${this.personalInfoFormGroup.value.address}`, 20, 70);
    doc.text(`Total Amount: ${this.totalAmount / 100} DNT`, 20, 80);

    // Ajouter la méthode de paiement si elle est sélectionnée
    doc.text(`Payment Method: ${this.selectedPaymentMethod}`, 20, 90);

    // Si vous avez un formulaire de livraison ou d'autres informations, vous pouvez les ajouter ici.
    if (this.selectedPaymentMethod === 'CREDIT_CARD') {
      doc.text(`Delivery Address: ${this.deliveryFormGroup.value.address}`, 20, 100);
    }

    // Ajouter une ligne de séparation pour la section footer
    doc.line(20, 110, 190, 110);

    // Ajouter un pied de page avec un message de remerciement
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text("Thank you for your order!", 105, 120, { align: 'center' });  // Centrer le texte

    // Ajouter une date de création de facture
    const date = new Date();
    doc.text(`Invoice Date: ${date.toLocaleDateString()}`, 20, 130);

    // Sauvegarder le PDF
    doc.save("invoice.pdf");
  }

  onOrderConfirmation() {
    this.generateInvoicePDF();  // Appeler la génération du PDF lors de la confirmation
  }
}
