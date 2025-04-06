import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CdkTableDataSourceInput } from '@angular/cdk/table';
@Component({
  selector: 'app-custom-order-list',
  imports: [
    MatInputModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule
  ],
  templateUrl: './custom-order-list.component.html',
  styleUrl: './custom-order-list.component.scss'
})
export class CustomOrderListComponent implements OnInit {
  orders: CustomOrder[] = [];
  filteredOrders: CustomOrder[] = [];
  filterText: string = '';
  statusFilter: string = '';
  searchText: string = '';
filteredDataSource: CdkTableDataSourceInput<any>;
displayedColumns: any;

@ViewChild(MatPaginator) paginator!: MatPaginator; // Ajout du paginator

  constructor(private orderService: CustomOrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe((data) => {
      this.orders = data;
      this.filteredOrders = data;
    });
  }

  applyFilter() {
    // Filter based on client name and status
    this.filteredOrders = this.orders.filter(order => {

      const matchesName = order.user?.toString().toLowerCase().includes(this.searchText.toLowerCase()) || false;//+
      const matchesStatus = order.status.toLowerCase().includes(this.statusFilter.toLowerCase());

      return matchesName && matchesStatus;
    });
  }

  deleteOrder(id: number) {
    this.orderService.deleteOrder(id).subscribe(() => {
      this.orders = this.orders.filter(order => order.id !== id);
      this.applyFilter(); // Reapply filter after deletion
    });
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredOrders);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }
}
