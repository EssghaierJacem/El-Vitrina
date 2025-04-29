import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { FormsModule } from '@angular/forms';
import { CustomOrder } from 'src/app/core/models/Panier/CustomOrder';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
import { UserService } from 'src/app/core/services/user/UserService';
import { User } from 'src/app/core/models/user/user.model';
import { Observable, forkJoin, map, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-custom-order-list',
  standalone: true,
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
export class CustomOrderListComponent implements OnInit, AfterViewInit {
  orders: (CustomOrder & { clientName?: string })[] = [];
  dataSource: MatTableDataSource<CustomOrder & { clientName?: string }> = new MatTableDataSource();
  displayedColumns: string[] = ['client', 'date', 'montant', 'statut', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: CustomOrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders(): void {
    this.orderService.getAllOrders().pipe(
      switchMap((orders: CustomOrder[]) => {
        this.orders = orders;
        const userObservables = orders.map(order =>
          this.userService.getUserById(order.userId).pipe(
            map(user => {
              // Add clientName to the order object
              return { ...order, clientName: user.name };
            }),
            catchError(() => of({ ...order, clientName: 'Unknown' })) // Handle errors gracefully
          )
        );
        return forkJoin(userObservables);
      })
    ).subscribe({
      next: (updatedOrders) => {
        this.orders = updatedOrders;
        this.dataSource.data = this.orders;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  applyFilter(): void {
    const filterValue = this.searchText?.trim().toLowerCase() || '';
    this.dataSource.filterPredicate = (data: CustomOrder & { clientName?: string }, filter: string): boolean => {
      const clientName = data.clientName?.toLowerCase() || '';
      const status = data.status?.toLowerCase() || '';
      return clientName.includes(filter) || status.includes(filter);
    };
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel(): void {
    const exportData = this.dataSource.filteredData.map(order => ({
      'Client ID': order.userId,
      'Client Name': order.clientName || 'Unknown',
      'Order Date': order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A',
      'Amount (TND)': order.price * order.quantity,
      'Status': order.status,
      'Products Count': order.productIds?.length || 0
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Custom Orders');
    XLSX.writeFile(wb, `custom_orders_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== id);
          this.dataSource.data = this.orders;
          this.applyFilter();
        },
        error: (err) => console.error('Error deleting order:', err)
      });
    }
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
