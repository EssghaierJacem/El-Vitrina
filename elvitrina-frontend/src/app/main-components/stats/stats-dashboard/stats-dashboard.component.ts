import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { StatsService } from 'src/app/core/services/stats/stats.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { OnInit, ViewChild, ElementRef } from '@angular/core';
Chart.register(...registerables);
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-stats-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule , RouterModule],
  templateUrl: './stats-dashboard.component.html',
  styleUrl: './stats-dashboard.component.scss'
})
export class StatsDashboardComponent implements OnInit {
  @ViewChild('postsChart', { static: true }) postsChartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  currentView: 'user' | 'date' = 'user'; 

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadUserStats(); 
  }

  loadUserStats(): void {
    this.currentView = 'user';
    this.statsService.getPostsStatsByUser().subscribe((data: any[]) => {
      const labels = data.map(stat => stat.user.firstname + ' ' + stat.user.lastname);
      const postCounts = data.map(stat => stat.postCount);
      this.createChart(labels, postCounts, 'Number of posts per user');
    });
  }

  // Chargement des statistiques par date
  loadDateStats(): void {
    this.currentView = 'date';
    this.statsService.getPostsStatsByDate().subscribe((data: any[]) => {
      const labels = data.map(stat => new Date(stat.date).toLocaleDateString());
      const postCounts = data.map(stat => stat.postCount);
      this.createChart(labels, postCounts, 'Number of posts per date');
    });
  }

  // Création du graphique
  createChart(labels: string[], data: number[], title: string): void {
    if (this.chart) {
      this.chart.destroy(); 
    }

    this.chart = new Chart(this.postsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: 'rgba(0, 38, 255, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: title,
            font: { size: 18 }
          }
        },
        scales: {
          x: {
            title: { display: true },
            ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 }
          },
          y: {
            beginAtZero: true,
            title: { display: true}
          }
        }
      }
    });
  }
}