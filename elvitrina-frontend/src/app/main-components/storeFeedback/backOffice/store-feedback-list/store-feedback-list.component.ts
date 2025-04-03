import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
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
  displayedColumns = ['id', 'type', 'rating', 'comment', 'wouldRecommend', 'createdAt', 'actions'];
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private storeFeedbackService: StoreFeedbackService) {
    this.dataSource = new MatTableDataSource<StoreFeedback>([]);
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
    this.storeFeedbackService.getAll().subscribe({
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

  getTypeDisplayName(type: StoreFeedbackType): string {
    return getStoreFeedbackTypeDisplayName(type);
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.storeFeedbackService.delete(id).subscribe(() => {
        this.loadFeedbacks();
      });
    }
  }
}
