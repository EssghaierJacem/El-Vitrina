import { Component, ViewChild } from '@angular/core';
import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ApexAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

export interface monthlyChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    responsive: ApexResponsive;
}

@Component({
    selector: 'app-monthly-earnings',
    imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, FormsModule,CommonModule],
    templateUrl: './monthly-earnings.component.html',
})
export class AppMonthlyEarningsComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public monthlyChart!: Partial<monthlyChart> | any;

    public latestMonthUsers: number = 0;
    public monthlyGrowth: number = 0;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loadMonthlyNewUsers();
    }

    loadMonthlyNewUsers(): void {
        this.http.get<{ [key: string]: number }>('http://localhost:8080/api/stats/monthly-new-users').subscribe({
            next: (data) => {
                const months = Array(12).fill(0); 
    
                Object.keys(data).forEach(monthStr => {
                    const monthIndex = parseInt(monthStr, 10) - 1; 
                    months[monthIndex] = data[monthStr];
                });
    
                this.latestMonthUsers = months[new Date().getMonth()] || 0; 
                const lastMonthUsers = months[new Date().getMonth() - 1] || 0; 
    
                if (lastMonthUsers > 0) {
                    this.monthlyGrowth = Math.round(((this.latestMonthUsers - lastMonthUsers) / lastMonthUsers) * 100);
                } else {
                    this.monthlyGrowth = 0;
                }
    
                this.monthlyChart = {
                    series: [
                        {
                            name: 'New Users',
                            color: '#49BEFF',
                            data: months,
                        },
                    ],
                    chart: {
                        type: 'area',
                        fontFamily: "'Plus Jakarta Sans', sans-serif;",
                        foreColor: '#adb0bb',
                        toolbar: { show: false },
                        height: 85,
                        sparkline: { enabled: true },
                        group: 'sparklines',
                    },
                    stroke: { curve: 'smooth', width: 2 },
                    fill: {
                        colors: ['#E8F7FF'],
                        type: 'solid',
                        opacity: 0.05,
                    },
                    markers: { size: 0 },
                    tooltip: {
                        theme: 'dark',
                        x: { show: false },
                    },
                };
            },
            error: (err) => {
                console.error('Failed to load monthly new users', err);
            }
        });
    }
    
}
