import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Store } from 'src/app/core/models/store/store.model';
import { StoreService } from 'src/app/core/services/store/store.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSortModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {
  dataSource: MatTableDataSource<Store>;
  stores: Store[] = [];
  isLoading = true;
  displayedColumns = ['storeId', 'storeName', 'category', 'status', 'featured', 'actions'];
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private storeService: StoreService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Store>([]);
  }

  ngOnInit(): void {
    this.loadStores();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStores() {
    this.isLoading = true;
    this.storeService.getAll().subscribe({
      next: (data) => {
        this.stores = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.snackBar.open('Error loading stores', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    const filterValue = this.searchText.toLowerCase();
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteStore(id: number) {
    if (confirm('Are you sure you want to delete this store?')) {
      this.storeService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Store deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadStores();
        },
        error: (error) => {
          console.error('Error deleting store:', error);
          this.snackBar.open('Error deleting store', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }
}
