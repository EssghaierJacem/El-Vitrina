import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
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
import * as XLSX from 'xlsx';
import { Page } from 'src/app/core/models/page.model';

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

  // Pagination properties
  pageSize = 5;
  pageIndex = 0;
  totalStores = 0;

  constructor(
    private storeService: StoreService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Store>([]);
  }

  ngOnInit(): void {
    console.log('Fetching all stores...');
    this.storeService.getAllStores().subscribe({
      next: (stores: Store[]) => {
        console.log('Stores fetched successfully:', stores);
        this.dataSource.data = stores;
        this.isLoading = false; // Update loading state
      },
      error: (error) => {
        console.error('Error fetching stores:', error);
        this.isLoading = false; // Ensure loading state is updated on error
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Ensure paginator is assigned
    this.dataSource.sort = this.sort;
  }

  loadPaginatedStores(): void {
    this.isLoading = true;
    this.storeService.getPaginatedStores(this.pageIndex, this.pageSize).subscribe({
      next: (response: Page<Store>) => {
        this.dataSource.data = response.content;
        this.totalStores = response.totalElements;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading stores:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPaginatedStores();
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  deleteStore(id: number) {
    if (confirm('Are you sure you want to delete this store?')) {
      this.storeService.delete(id).subscribe({
        next: () => {
          this.loadPaginatedStores();
          this.snackBar.open('Store deleted successfully', 'Close', {
            duration: 3000
          });
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

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.stores);
  
    if (!ws['!ref']) {
      console.error('Sheet reference range is undefined.');
      return;
    }
  
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4CAF50' } }, 
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
      }
    };
  
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { r: range.s.r, c: col }; 
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!ws[cellRef]) continue;
      ws[cellRef].s = headerStyle;
    }
  
    const dataStyle = {
      font: { color: { rgb: '000000' } },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
      },
    };
  
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = { r: row, c: col };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (!ws[cellRef]) continue;
        ws[cellRef].s = dataStyle; 
      }
    }
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stores');
  
    XLSX.writeFile(wb, 'List of Stores.xlsx');
  }
}
