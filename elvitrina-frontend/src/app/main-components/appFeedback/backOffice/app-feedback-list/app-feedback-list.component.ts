import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppFeedback } from 'src/app/core/models/appFeedback/app-feedback.model';
import { AppFeedbackService } from 'src/app/core/services/appFeedback/app-feedback.service';
import { OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
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
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './app-feedback-list.component.html',
  styleUrls: ['./app-feedback-list.component.scss'],
})
export class AppFeedbackListComponent {
  feedbacks: AppFeedback[] = [];
  isLoading = true;
  displayedColumns = ['id', 'type', 'comment', 'createdAt', 'actions'];

  constructor(private feedbackService: AppFeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackService.getAll().subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  deleteFeedback(id: number) {
    this.feedbackService.delete(id).subscribe(() => this.loadFeedbacks());
  }
}