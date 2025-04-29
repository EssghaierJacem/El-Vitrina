import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreFeedback } from 'src/app/core/models/storeFeedback/store-feedback.model';
import { StoreFeedbackService } from 'src/app/core/services/storeFeedback/store-feedback.service';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from 'src/app/core/models/storeFeedback/store-feedback-type.enum';
import * as XLSX from 'xlsx';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-store-feedback-list',
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
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSortModule,
    MatChipsModule
  ],
  templateUrl: './store-feedback-list.component.html',
  styleUrls: ['./store-feedback-list.component.scss']
})
export class StoreFeedbackListComponent implements OnInit {
  dataSource: MatTableDataSource<StoreFeedback>;
  feedbacks: StoreFeedback[] = [];
  isLoading = true;
  displayedColumns = ['type', 'rating', 'comment', 'wouldRecommend', 'createdAt', 'actions'];
  searchText = '';
  pageIndex = 0;
  pageSize = 10;
  totalFeedbacks = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private storeFeedbackService: StoreFeedbackService, private cdr: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<StoreFeedback>([]);
  }

  ngOnInit(): void {
    this.loadPaginatedFeedbacks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadPaginatedFeedbacks();
  }

  loadPaginatedFeedbacks(): void {
    console.log('Loading paginated feedbacks with:', {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText
    });

    this.isLoading = true;
    this.storeFeedbackService.getPaginatedFeedbacks(this.pageIndex, this.pageSize, this.searchText).subscribe({
      next: (response) => {
        console.log('Backend response:', response); // Log the entire backend response

        // Handle response as an array
        if (Array.isArray(response)) {
          this.dataSource.data = response;
          this.totalFeedbacks = response.length;
        } else {
          // Handle response as a paginated object
          this.dataSource.data = response.content || [];
          this.totalFeedbacks = response.totalElements || 0;
        }

        console.log('Updated dataSource:', this.dataSource.data);
        console.log('Total feedbacks:', this.totalFeedbacks);

        if (this.paginator) {
          this.paginator.length = this.totalFeedbacks;
          this.paginator.pageSize = this.pageSize;
          this.paginator.pageIndex = this.pageIndex;
        }

        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.isLoading = false;
        alert('Failed to load feedbacks. Please check console for details.');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPaginatedFeedbacks();
  }

  applyFilter() {
    const filterValue = this.searchText.toLowerCase();
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTypeDisplayName(type: StoreFeedbackType): string {
    return getStoreFeedbackTypeDisplayName(type);
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.storeFeedbackService.delete(id).subscribe(() => {
        this.loadPaginatedFeedbacks(); // Corrected method call
      });
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.feedbacks);
  
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
    XLSX.utils.book_append_sheet(wb, ws, 'Store Feedback');
  
    XLSX.writeFile(wb, 'List of Store Feedback.xlsx');
  }
}
