import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';

export interface ProductOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

interface Month {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, MatButtonModule, CommonModule, FormsModule],
})
export class AppSalesOverviewComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public productOverviewChart!: Partial<ProductOverviewChart> | any;
  public selectedMonth: string = ''; 
  public months: Month[] = [];

  private monthNamesMap = [
    { value: 'jan', viewValue: 'January' },
    { value: 'feb', viewValue: 'February' },
    { value: 'mar', viewValue: 'March' },
    { value: 'apr', viewValue: 'April' },
    { value: 'may', viewValue: 'May' },
    { value: 'jun', viewValue: 'June' },
    { value: 'jul', viewValue: 'July' },
    { value: 'aug', viewValue: 'August' },
    { value: 'sep', viewValue: 'September' },
    { value: 'oct', viewValue: 'October' },
    { value: 'nov', viewValue: 'November' },
    { value: 'dec', viewValue: 'December' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProductStats();
  }

  loadProductStats(): void {
    this.http.get<{ [key: string]: number }>('/api/stats/products-added-monthly').subscribe({
      next: (data) => {
        const dynamicMonths: Month[] = [];
        const dynamicSeriesData: number[] = [];

        Object.keys(data).forEach(monthStr => {
          const monthIndex = parseInt(monthStr, 10) - 1;
          const monthInfo = this.monthNamesMap[monthIndex];

          if (monthInfo) {
            dynamicMonths.push(monthInfo);
            dynamicSeriesData.push(data[monthStr]);
          }
        });

        this.months = dynamicMonths;
        if (this.months.length > 0) {
          this.selectedMonth = this.months[0].value; 
        }

        this.productOverviewChart = {
          series: [
            {
              name: 'Products Added',
              data: dynamicSeriesData,
              color: '#5D87FF',
            },
          ],
          chart: {
            type: 'bar',
            height: 390,
            offsetX: -15,
            toolbar: { show: false },
            foreColor: '#adb0bb',
            fontFamily: 'inherit',
            sparkline: { enabled: false },
          },
          plotOptions: {
            bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
          },
          xaxis: {
            type: 'category',
            categories: dynamicMonths.map(m => m.viewValue), 
            labels: {
              style: { cssClass: 'grey--text lighten-2--text fill-color' },
            },
          },
          yaxis: {
            show: true,
            min: 0,
            tickAmount: 4,
            labels: {
              style: { cssClass: 'grey--text lighten-2--text fill-color' },
            },
          },
          dataLabels: { enabled: false },
          markers: { size: 0 },
          legend: { show: false },
          grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: { lines: { show: false } },
          },
          stroke: {
            show: true,
            width: 3,
            lineCap: 'butt',
            colors: ['transparent'],
          },
          tooltip: { theme: 'light' },
          responsive: [
            {
              breakpoint: 600,
              options: {
                plotOptions: {
                  bar: { borderRadius: 3 },
                },
              },
            },
          ],
        };
      },
      error: (err) => {
        console.error('Failed to load product stats', err);
      }
    });
  }
}
