import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { FormsModule } from '@angular/forms';

import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';

import { MatSortModule } from '@angular/material/sort';
@Component({
  selector: 'app-custom-order-list',
  imports: [
    FormsModule,
    RouterModule,
    MatInputModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,

  ],
  templateUrl: './custom-order-list.component.html',
  styleUrls: ['./custom-order-list.component.scss']
})
export class CustomOrderListComponent implements OnInit {
  orders: CustomOrder[] = [];
  dataSource: MatTableDataSource<CustomOrder> = new MatTableDataSource<CustomOrder>();
  displayedColumns: string[] = ['client', 'date', 'montant', 'statut', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: CustomOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe((data: CustomOrder[]) => {
      this.orders = data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(): void {
    const filterValue = this.searchText?.trim().toLowerCase() || '';

    this.dataSource.filterPredicate = (data: CustomOrder, filter: string): boolean => {
      const client = data.userId?.toString() || '';
      const status = data.status?.toLowerCase() || '';
      return client.includes(filter) || status.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }

  exportToExcel(): void {
    const exportData = this.dataSource.filteredData.map(order => ({
    //  Client: order.user?.username,
   // Date: order.dateCustomOrder,
    //  Montant: order.totalAmount,
      Statut: order.status
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Commandes');
    XLSX.writeFile(wb, 'commandes_personnalisees.xlsx');
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrder(id).subscribe(() => {
      this.orders = this.orders.filter(order => order.id !== id);
      this.dataSource.data = this.orders;
      this.applyFilter();
    });
  }

  getStatusClass(status: string | null | undefined): string {
    const safeStatus = status?.toLowerCase() ?? 'default';
    switch (safeStatus) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return 'status-default';
    }
  }  
}
