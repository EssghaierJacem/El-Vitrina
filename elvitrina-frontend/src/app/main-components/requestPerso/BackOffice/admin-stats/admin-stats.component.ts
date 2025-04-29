// admin-stats.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminStatsService } from 'src/app/core/services/requestPerso/admin-stats.service';
import { Stats, ChartData } from 'src/app/core/models/requestPerso/stats.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import * as moment from 'moment';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.scss'],
  providers: [DatePipe],
  standalone: true,
  imports: [
    NgxChartsModule,
    MatCardModule,
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class AdminStatsComponent implements OnInit, OnDestroy {
  stats: Stats | null = null;
  loading = true;
  dateRange = {
    start: moment().subtract(30, 'days').toDate(),
    end: new Date()
  };

  // Chart data with proper initialization
  chartData: ChartData = {
    requestsByDate: [{ name: 'Requests', series: [] }],
    proposalsByDate: [{ name: 'Proposals', series: [] }],
    requestsByStatus: []
  };

  // Chart configuration
  view: [number, number] = [1000, 400];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private statsService: AdminStatsService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions when component is destroyed
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadStats(): void {
    this.loading = true;
    
    const sub = this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        this.handleError('Failed to load statistics', error);
        this.loading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  loadStatsByDateRange(): void {
    const startDate = this.datePipe.transform(this.dateRange.start, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.dateRange.end, 'yyyy-MM-dd');
    
    if (!startDate || !endDate) {
      this.snackBar.open('Invalid date range', 'Close', { duration: 3000 });
      return;
    }
    
    // Validate date range
    if (moment(this.dateRange.end).isBefore(this.dateRange.start)) {
      this.snackBar.open('End date must be after start date', 'Close', { duration: 3000 });
      return;
    }
    
    this.loading = true;
    
    const sub = this.statsService.getStatsByDateRange(startDate, endDate).subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        this.handleError('Failed to load statistics for selected date range', error);
        this.loading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  prepareChartData(): void {
    if (!this.stats) return;
    
    // Safely map the requests by date
    this.chartData.requestsByDate = [{
      name: 'Requests',
      series: Object.entries(this.stats.requestsByDate || {}).map(([name, value]) => ({ 
        name, 
        value: typeof value === 'number' ? value : 0
      }))
    }];
    
    // Safely map the proposals by date
    this.chartData.proposalsByDate = [{
      name: 'Proposals',
      series: Object.entries(this.stats.proposalsByDate || {}).map(([name, value]) => ({ 
        name, 
        value: typeof value === 'number' ? value : 0 
      }))
    }];
    
    // Safely map the requests by status
    this.chartData.requestsByStatus = Object.entries(this.stats.requestsByStatus || {}).map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0
    }));
  }

  onDateChange(type: 'start' | 'end', event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.dateRange[type] = event.value;
      this.loadStatsByDateRange();
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(`${message}: ${error.message || 'Unknown error'}`, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}