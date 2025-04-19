import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStatusType } from 'src/app/core/models/Panier/OrderStatusType.type';
import { Product } from 'src/app/core/models/product/product.model';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { ProductService } from '../../../../core/services/product/product.service';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-to-cart-dialog',
  imports: [  CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatFormFieldModule,
      MatCardModule,
      MatSelectModule,
      MatDatepickerModule,
      MatIconModule,
      MatNativeDateModule],
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrl: './add-to-cart-dialog.component.scss'
})
export class AddToCartDialogComponent implements OnInit {
  productId: number = 0;
  order: CustomOrder = {
    productIds: [],
    quantity: 1,
    price: 0,
    orderDate: new Date(),
    calculateTotal: 0,
    status: OrderStatusType.PENDING,
    userId: 0,
    paymentId: null
  };
  product: any = {};
  userId: number | null = null; // Utilisateur simulé (remplacer par logique réelle d'authentification)
  currentUser: any;
  firstName = '';
  email = '';


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: CustomOrderService,
    private router: Router,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder



  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du produit depuis l'URL
    const id = this.route.snapshot.paramMap.get('productId');
    if (id) {
      this.productId = +id;
      this.order.productIds = [this.productId];
      this.loadProductDetails();
    } else {
      alert("Aucun produit trouvé !");
    }

    const token = this.tokenService.getToken();

    if (!token) {
     this.snackBar.open('Please log in to create a store', 'Close', {
         duration: 3000,
         panelClass: ['error-snackbar']
     });
     this.router.navigate(['/authentication/login']);

 }
else {
       this.loadCurrentUser();
   }


   console.log(token);
  //  this.RequestForm = this.fb.group({
  //    title: ['', Validators.required],
  //    description: ['', [Validators.required, Validators.maxLength(5000)]],
  //    minPrice: [0, [Validators.required, Validators.min(0)]],
  //    maxPrice: [0, [Validators.required, Validators.min(0)]],
  //    image: ['', Validators.required],
  //    deliveryTime: [null, Validators.required],
  //  });// Date actuelle
    // Récupérer le nom de l'utilisateur
    this.order.userId = this.currentUser.id;
    this.order.orderDate = new Date(); // Date actuelle
  }
  private loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.id ?? null;
      console.log(this.userId);
      this.firstName = decodedToken.firstname || '';
      this.email = decodedToken.email || '';

      // For backward compatibility
      this.currentUser = {
        id: this.userId,
        name: this.firstName,
        email: this.email
      };
    }
  }
  loadProductDetails() {
    // Charger les détails du produit
    this.productService.getById(this.productId).subscribe(product => {
      this.product = product;
      this.order.price = product.price; // Définir le prix du produit
    });
  }

  increaseQuantity() {
    this.order.quantity++;
  }

  decreaseQuantity() {
    if (this.order.quantity > 1) this.order.quantity--;
  }

  createOrder() {
    // Calculer le total de la commande
    this.order.calculateTotal = this.order.quantity * this.order.price;

    // Créer la commande via le service
    this.orderService.createOrder(this.order).subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error('Erreur:', err);
        alert('Erreur lors de la création de la commande.');
      }
    });
  }
}
