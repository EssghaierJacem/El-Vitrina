import { Component, OnInit } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-order-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './custom-order-view.component.html',
  styleUrl: './custom-order-view.component.scss'
})
export class CustomOrderViewComponent implements OnInit  {
  order: CustomOrder | null = null;

  constructor(private orderService: CustomOrderService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe((data) => {
      this.order = data;
    });
  }
  editOrder() {
    if (this.order) {
   //   this.router.navigate(['/orders/edit', this.order.id]);
    }
  }

  deleteOrder() {
    if (this.order) {
      this.orderService.deleteOrder(this.order.id).subscribe(() => {
        alert('Commande supprimée avec succès');
       // this.router.navigate(['/orders']);
      });
    }
  }

  nextOrder() {
   // const nextId = this.order ? this.order.id + 1 : 1;
    //this.router.navigate(['/orders', nextId]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'SHIPPED':
        return 'status-shipped';
      default:
        return '';
    }
  }


}
