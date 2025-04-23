import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StatService } from 'src/app/core/services/PayQuiz/stat.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-dashboard',
  templateUrl: './stat-dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    FormsModule
  ],
  styleUrls: ['./stat-dashboard.component.scss']
})
export class StatDashboardComponent implements OnInit {
  totalOrders = 0;
  totalPayments = 0;
  totalRevenue = 0;

  ordersChartData: { name: string, value: number }[] = [];
  paymentsChartData: { name: string, value: number }[] = [];
  revenueChartData: { name: string, value: number }[] = [];
  months = [
    { value: 1, name: 'Janvier' },
    { value: 2, name: 'Février' },
    { value: 3, name: 'Mars' },
    { value: 4, name: 'Avril' },
    { value: 5, name: 'Mai' },
    { value: 6, name: 'Juin' },
    { value: 7, name: 'Juillet' },
    { value: 8, name: 'Août' },
    { value: 9, name: 'Septembre' },
    { value: 10, name: 'Octobre' },
    { value: 11, name: 'Novembre' },
    { value: 12, name: 'Décembre' }
  ];

  years = [2024, 2025];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.loadOverview(); // Charge les données globales initiales
    this.loadOrdersByStatus(); // Charge les données des commandes par statut
    this.loadPaymentsByMethod(); // Charge les données des paiements par méthode
    this.loadOverviewByMonth(); // Charge les données pour le mois sélectionné
  }

  loadOverview() {
    this.statService.getOverview().subscribe(data => {
      this.totalOrders = data.totalOrders;
      this.totalPayments = data.totalPayments;
      this.totalRevenue = data.totalRevenue;
    });
  }

  loadOrdersByStatus() {
    this.statService.getOrdersByStatus().subscribe(data => {
      this.ordersChartData = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value as number
      }));
    });
  }

  loadPaymentsByMethod() {
    this.statService.getPaymentsByMethod().subscribe(data => {
      this.paymentsChartData = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value as number
      }));
    });
  }

  loadOverviewByMonth() {
    this.statService.getOverviewByMonth(this.selectedYear, this.selectedMonth).subscribe(data => {
      this.totalOrders = data.totalOrders;
      this.totalPayments = data.totalPayments;
      this.totalRevenue = data.totalRevenue;
      this.loadOrdersByStatusByMonth();
      this.loadPaymentsByMethodByMonth();
      this.loadRevenueByMonth();
    });
  }

  loadOrdersByStatusByMonth() {
    this.statService.getOrdersByStatusByMonth(this.selectedYear, this.selectedMonth).subscribe(data => {
      this.ordersChartData = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value as number
      }));
    });
  }

  loadPaymentsByMethodByMonth() {
    this.statService.getPaymentsByMethodByMonth(this.selectedYear, this.selectedMonth).subscribe(data => {
      this.paymentsChartData = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value as number
      }));
    });
  }

  loadRevenueByMonth() {
    this.statService.getOverviewByMonth(this.selectedYear, this.selectedMonth).subscribe(data => {
      this.revenueChartData = data.revenueChartData || [];
    });
  }
}
