import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';

@Component({
  selector: 'app-custom-order-list-side',
  imports: [ CommonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule],
  templateUrl: './custom-order-list-side.component.html',
  styleUrl: './custom-order-list-side.component.scss'
})
export class CustomOrderListSideComponent {
  @Input() order!: CustomOrder;
}
