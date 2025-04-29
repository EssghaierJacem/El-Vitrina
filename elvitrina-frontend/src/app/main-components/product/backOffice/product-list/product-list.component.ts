import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { Product } from 'src/app/core/models/product/product.model';
import { ProductCategoryType } from 'src/app/core/models/product/product-category-type.enum';
import { ProductService } from 'src/app/core/services/product/product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-list',
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
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  dataSource: MatTableDataSource<Product>;
  products: Product[] = [];
  isLoading = true;
  displayedColumns = ['productName', 'price', 'stockQuantity', 'category', 'actions'];
  searchText = '';
  categories: ProductCategoryType[] = Object.values(ProductCategoryType);
  pageIndex = 0;
  pageSize = 10;
  totalProducts = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<Product>([]);
  }

  ngOnInit(): void {
    this.loadPaginatedProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewChecked(): void {
    if (this.paginator && !this.dataSource.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        console.log('Products loaded:', data); // Debugging log
        this.products = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error loading products', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  loadPaginatedProducts(): void {
    this.isLoading = true;
    this.productService.getPaginatedProducts(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        console.log('Paginated products loaded:', response.content); // Debugging log
        this.dataSource.data = response.content;
        this.totalProducts = response.totalElements;
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPaginatedProducts();
  }

  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);
  
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
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
  
    XLSX.writeFile(wb, 'List of Products.xlsx');
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Error deleting product', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }

  getCategoryDisplayName(category: ProductCategoryType): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
