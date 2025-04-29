import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppFeedback } from 'src/app/core/models/appFeedback/app-feedback.model';
import { AppFeedbackService } from 'src/app/core/services/appFeedback/app-feedback.service';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { HeaderComponent } from 'src/app/layouts/full/header/header.component';
import { SidebarComponent } from 'src/app/layouts/full/sidebar/sidebar.component';

@Component({
  selector: 'app-app-feedback-list',
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
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './app-feedback-list.component.html',
  styleUrls: ['./app-feedback-list.component.scss'],
})
export class AppFeedbackListComponent implements OnInit {
  dataSource: MatTableDataSource<AppFeedback>;
  feedbacks: AppFeedback[] = [];
  isLoading = true;
  displayedColumns = ['type', 'comment', 'createdAt', 'actions'];
  searchText = '';
  totalFeedbacks = 0;
  pageIndex = 0;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private feedbackService: AppFeedbackService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<AppFeedback>([]);
  }

  ngOnInit(): void {
    this.loadPaginatedFeedbacks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.loadPaginatedFeedbacks();
  }

  loadFeedbacks() {
    this.isLoading = true;
    this.feedbackService.getAll(
      this.paginator?.pageIndex || 0,
      this.paginator?.pageSize || 10,
      this.searchText
    ).subscribe({
      next: (response) => {
        this.feedbacks = response.content;
        this.dataSource.data = response.content;
        if (this.paginator) {
          this.paginator.length = response.totalElements;
          this.paginator.pageSize = response.size;
          this.paginator.pageIndex = response.number;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.isLoading = false;
      }
    });
  }

  loadPaginatedFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getPaginatedFeedbacks(
      this.pageIndex, 
      this.pageSize, 
      this.searchText
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.totalFeedbacks = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.isLoading = false;
        // Add user feedback here:
        alert('Failed to load feedbacks. Please check console for details.');
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
    XLSX.utils.book_append_sheet(wb, ws, 'App Feedback');
  
    XLSX.writeFile(wb, 'List of App Feedback.xlsx');
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.delete(id).subscribe(() => {
        this.loadFeedbacks();
      });
    }
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPaginatedFeedbacks();
  }
}