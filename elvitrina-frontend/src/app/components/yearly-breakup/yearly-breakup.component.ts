import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TablerIconsModule } from 'angular-tabler-icons';
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
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface yearlyChart {
    series: number[];
    labels: string[];
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    responsive: ApexResponsive;
}

@Component({
    selector: 'app-yearly-breakup',
    templateUrl: './yearly-breakup.component.html',
    imports: [MaterialModule, NgApexchartsModule, TablerIconsModule,CommonModule,FormsModule],
    encapsulation: ViewEncapsulation.None,
})
export class AppYearlyBreakupComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);

    public yearlyChart!: Partial<yearlyChart> | any;
    public totalDonations: number = 0;
    public yearlyGrowth: number = 0;
    public currentYear: number = new Date().getFullYear();
    public lastYear: number = this.currentYear - 1;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loadYearlyDonations();
    }

    loadYearlyDonations(): void {
        this.http.get<{ [key: string]: number }>('/api/api/stats/yearly-donations').subscribe({
            next: (data) => {
                const labels = Object.keys(data).map(y => y);
                const series = Object.values(data);

                this.totalDonations = series.reduce((sum, value) => sum + value, 0);

                const currentYearDonations = data[this.currentYear.toString()] || 0;
                const lastYearDonations = data[this.lastYear.toString()] || 0;

                if (lastYearDonations > 0) {
                    this.yearlyGrowth = Math.round(((currentYearDonations - lastYearDonations) / lastYearDonations) * 100);
                } else {
                    this.yearlyGrowth = 0;
                }

                this.yearlyChart = {
                    series: series,
                    labels: labels,
                    chart: {
                        width: 125,
                        type: "donut",
                        fontFamily: "inherit",
                        foreColor: "#adb0bb",
                    },
                    plotOptions: {
                        pie: {
                            startAngle: 0,
                            endAngle: 360,
                            donut: {
                                size: "75%",
                            },
                        },
                    },
                    stroke: { show: false },
                    dataLabels: { enabled: false },
                    legend: { show: false },
                    colors: ['#5D87FF', '#ECF2FF', '#F9F9FD'],
                    responsive: [
                        {
                            breakpoint: 991,
                            options: {
                                chart: {
                                    width: 120,
                                },
                            },
                        },
                    ],
                    tooltip: {
                        theme: "dark",
                        fillSeriesColor: false,
                    },
                };
            },
            error: (err) => {
                console.error('Failed to load yearly donations', err);
            }
        });
    }
}
