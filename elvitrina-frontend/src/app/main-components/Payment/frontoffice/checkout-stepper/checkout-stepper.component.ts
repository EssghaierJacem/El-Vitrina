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
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 8;
    let y = 30;

    const rightAlign = (label: string, value: string, offset = 80) => {
      doc.text(label, margin, y);
      doc.text(value, margin + offset, y, { align: 'right' });
      y += lineHeight;
    };

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text("INVOICE", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice Number: #${new Date().getTime()}`, margin, y);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: 'right' });
    y += 10;

    // Separator
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Customer Information
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('bold');
    doc.text("Billing Information", margin, y);
    y += lineHeight;

    doc.setFont( 'normal');
    rightAlign("Full Name:", this.personalInfoFormGroup.value.fullName);
    rightAlign("Phone:", this.personalInfoFormGroup.value.phone);
    rightAlign("Email:", this.personalInfoFormGroup.value.email);
    rightAlign("Address:", this.personalInfoFormGroup.value.address);
    y += 5;

    // Separator
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Payment Details
    doc.setFont( 'bold');
    doc.text("Payment Details", margin, y);
    y += lineHeight;

    doc.setFont('normal');
    rightAlign("Payment Method:", this.selectedPaymentMethod.replace('_', ' '));
    rightAlign("Total Amount:", `${this.totalAmount} TND`);
    if (this.selectedPaymentMethod === 'CREDIT_CARD') {
      rightAlign("Delivery Address:", this.deliveryFormGroup.value.address);
    }
    y += 5;

    // Summary Box
    doc.setFont('bold');
    doc.setDrawColor(180);
    doc.rect(margin, y, pageWidth - 2 * margin, 25);

    y += 8;
    doc.text("Amount Due", margin + 5, y);
    doc.setFontSize(14);
    doc.text(`${this.totalAmount} TND`, pageWidth - margin - 5, y, { align: 'right' });

    y += 15;
    doc.setFontSize(10);
    doc.setFont('normal');
    doc.text("Please keep this invoice as a proof of your purchase.", margin + 5, y);

    y += 10;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setTextColor(100);
    doc.text("Thank you for your order!", pageWidth / 2, y, { align: 'center' });

    // Save
    doc.save(`invoice_${new Date().getTime()}.pdf`);
  }



  onOrderConfirmation() {
    this.generateInvoicePDF();  // Appeler la génération du PDF lors de la confirmation
  }
}
