import { Component, ViewChild, OnInit } from '@angular/core';
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
  displayedColumns = ['id', 'type', 'comment', 'createdAt', 'actions'];
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private feedbackService: AppFeedbackService) {
    this.dataSource = new MatTableDataSource<AppFeedback>([]);
  }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadFeedbacks() {
    this.isLoading = true;
    this.feedbackService.getAll().subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
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

  exportToExcel(): void {
    const data = this.feedbacks.map(feedback => ({
      ID: feedback.id,
      Type: feedback.appFeedbackType,
      Comment: feedback.comment,
      'Created At': new Date(feedback.createdAt).toLocaleDateString()
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Feedbacks');
    XLSX.writeFile(wb, 'app_feedbacks.xlsx');
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.delete(id).subscribe(() => {
        this.loadFeedbacks();
      });
    }
  }
}