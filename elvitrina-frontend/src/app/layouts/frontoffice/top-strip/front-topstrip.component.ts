import { Component,ViewChild, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common'; // Import du CommonModule
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CustomOrderService } from 'src/app/core/services/Panier/CustomOrderService';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
    selector: 'front-topstrip',
    standalone: true, // Indique que c'est un composant standalone
    imports: [ MatButtonModule,
      MatMenuModule,
      CommonModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      TablerIconsModule,
      ],
    templateUrl: './front-topstrip.component.html',
})
export class FrontTopstripComponent implements OnInit{
  orders: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['client', 'date', 'montant', 'statut'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private orderService: CustomOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe((data: any[]) => {
      this.orders = data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
