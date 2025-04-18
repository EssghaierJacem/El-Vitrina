import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ActionHistory } from 'src/app/core/models/ActionHistory/actionHistory';
import { ActionHistoryService } from 'src/app/core/services/ActionHistory/action-history-service';

@Component({
  selector: 'app-history-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './history-dashboard.component.html',
  styleUrl: './history-dashboard.component.scss'
})
export class HistoryDashboardComponent implements OnInit {
  historyList: ActionHistory[] = [];
  filteredList: ActionHistory[] = [];
  entityTypes: string[] = [];
  selectedEntityType: string = '';
  isLoading = true;

  constructor(private historyService: ActionHistoryService) {}

  ngOnInit(): void {
    this.historyService.getAllHistory().subscribe({
      next: (history) => {
        this.historyList = history;
        this.filteredList = [...history];
        this.entityTypes = Array.from(new Set(history.map(item => item.entityType))).sort();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  applyEntityTypeFilter(): void {
    if (!this.selectedEntityType) {
      this.filteredList = [...this.historyList];
    } else {
      this.filteredList = this.historyList.filter(
        item => item.entityType === this.selectedEntityType
      );
    }
  }
}
