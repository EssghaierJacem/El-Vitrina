import { Component } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { ActivatedRoute, Router } from '@angular/router';//+
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-order-edit',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './custom-order-edit.component.html',
  styleUrl: './custom-order-edit.component.scss'
})
export class CustomOrderEditComponent {
  order: CustomOrder ;

  constructor(private orderService: CustomOrderService, private route: ActivatedRoute, private router: Router) {}


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe((data) => {
      this.order = data;
    });
  }

  updateOrder() {
    if (this.order) {
      this.orderService.updateOrder(this.order).subscribe(() => {
        this.router.navigate(['/orders']);
      });
    }
  }


}
