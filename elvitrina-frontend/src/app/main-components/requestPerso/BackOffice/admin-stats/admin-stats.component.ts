import { Component, OnInit } from '@angular/core';
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
  ]
})
export class AdminStatsComponent implements OnInit {
  stats: any;
  loading = true;
  dateRange: any = {
    start: moment().subtract(30, 'days').toDate(),
    end: new Date()
  };
  chartData: any = {};
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

  constructor(
    private statsService: AdminStatsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadStatsByDateRange(): void {
    this.loading = true;
    this.statsService.getStatsByDateRange(
      this.datePipe.transform(this.dateRange.start, 'yyyy-MM-dd') || '',
      this.datePipe.transform(this.dateRange.end, 'yyyy-MM-dd') || ''
    ).subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  prepareChartData(): void {
    this.chartData.requestsByDate = [{
      name: 'Requests',
      series: Object.entries(this.stats.requestsByDate || {}).map(([name, value]) => ({ name, value }))
    }];
    this.chartData.proposalsByDate = [{
      name: 'Proposals',
      series: Object.entries(this.stats.proposalsByDate || {}).map(([name, value]) => ({ name, value }))
    }];
    this.chartData.requestsByStatus = Object.entries(this.stats.requestsByStatus || {}).map(([name, value]) => ({
      name,
      value
    }));
  }

  onDateChange(type: 'start' | 'end', event: MatDatepickerInputEvent<Date>): void {
    this.dateRange[type] = event.value;
    this.loadStatsByDateRange();
  }
}
