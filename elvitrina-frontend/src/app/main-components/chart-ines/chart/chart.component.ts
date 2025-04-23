import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StoreCategoryType } from '../../../core/models/store/store-category-type.enum';
import { StoreFeedbackType, getStoreFeedbackTypeDisplayName } from '../../../core/models/storeFeedback/store-feedback-type.enum';
import { ProductCategoryType } from '../../../core/models/product/product-category-type.enum';
import { ProductStatus } from '../../../core/models/product/product-status.enum';
import { StatisticsService } from '../../../core/services/statistics.service';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil, catchError } from 'rxjs';

// Define interfaces for the API responses
interface FeedbackAnalysis {
  averageRating: number;
  totalFeedbacks: number;
  ratingDistribution: { [key: string]: number };
}

interface CategoryCount {
  category: StoreCategoryType;
  count: number;
}

interface ProductStatusCount {
  status: string;
  count: number;
}

interface ProductCategoryPerformance {
  category: string;
  salesVolume: number;
}

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  providers: [StatisticsService]
})
export class ChartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Chart objects
  storeCategoryChart: Chart | null = null;
  feedbackChart: Chart | null = null;
  productStatusChart: Chart | null = null;
  productCategoryChart: Chart | null = null;

  // Chart data
  storeCategoryData: any;
  feedbackData: any;
  productStatusData: any;
  productCategoryData: any;

  // Loading states
  isLoading = {
    storeCategory: true,
    feedback: true,
    productStatus: true,
    productCategory: true
  };

  // Error states
  hasError = {
    storeCategory: false,
    feedback: false,
    productStatus: false,
    productCategory: false
  };

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.fetchStoresByCategory();
    this.fetchFeedbackAnalysis();
    this.fetchProductsByStatus();
    this.fetchProductPerformanceByCategory();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Destroy existing charts to prevent memory leaks
    if (this.storeCategoryChart) this.storeCategoryChart.destroy();
    if (this.feedbackChart) this.feedbackChart.destroy();
    if (this.productStatusChart) this.productStatusChart.destroy();
    if (this.productCategoryChart) this.productCategoryChart.destroy();
  }

  private fetchStoresByCategory() {
    this.statisticsService.getStoresByCategory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          if (!Array.isArray(data)) {
            console.error('Expected array data for category distribution');
            this.hasError.storeCategory = true;
            return;
          }

          const labels = data.map(item => this.formatCategoryName(item.category));
          const values = data.map(item => item.count);
          
          this.storeCategoryData = {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: this.generateColorArray(labels.length),
              hoverOffset: 4
            }]
          };
          
          this.isLoading.storeCategory = false;
          this.initializeStoreCategoryChart();
        },
        error: (error: Error) => {
          console.error('Error fetching store categories:', error);
          this.isLoading.storeCategory = false;
          this.hasError.storeCategory = true;
        }
      });
  }

  private fetchFeedbackAnalysis() {
    this.statisticsService.getFeedbackAnalysis()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FeedbackAnalysis) => {
          const ratings = [1, 2, 3, 4, 5];
          const values = ratings.map(rating => data.ratingDistribution[rating] || 0);
          
          this.feedbackData = {
            labels: ratings.map(rating => `${rating} Star${rating !== 1 ? 's' : ''}`),
            datasets: [{
              label: 'Number of Reviews',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 1,
              borderRadius: 5,
              hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)'
            }]
          };
          
          this.isLoading.feedback = false;
          this.initializeFeedbackChart();
        },
        error: (error: Error) => {
          console.error('Error fetching feedback data:', error);
          this.isLoading.feedback = false;
          this.hasError.feedback = true;
        }
      });
  }

  private fetchProductsByStatus() {
    this.statisticsService.getProductsByStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          if (!data || typeof data.count === 'undefined') {
            console.error('Invalid data format for product status');
            this.hasError.productStatus = true;
            return;
          }

          const labels = ['Active', 'Inactive'];
          const values = [data.count, 0]; // We only have active count for now
          
          this.productStatusData = {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 99, 132, 0.8)'
              ],
              hoverBackgroundColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }]
          };
          
          this.isLoading.productStatus = false;
          this.initializeProductStatusChart();
        },
        error: (error: Error) => {
          console.error('Error fetching product status data:', error);
          this.isLoading.productStatus = false;
          this.hasError.productStatus = true;
        }
      });
  }

  private fetchProductPerformanceByCategory() {
    this.statisticsService.getProductPerformanceByCategory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          if (!Array.isArray(data)) {
            console.error('Expected array data for product category performance');
            this.hasError.productCategory = true;
            return;
          }

          // Sort by count in descending order
          data.sort((a, b) => b.count - a.count);
          
          // Take top 10 for better visualization
          const topData = data.slice(0, 10);
          
          const labels = topData.map(item => this.formatCategoryName(item.category));
          const values = topData.map(item => item.count);
          
          this.productCategoryData = {
            labels: labels,
            datasets: [{
              label: 'Product Count',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
              borderRadius: 5,
              hoverBackgroundColor: 'rgba(75, 192, 192, 0.9)'
            }]
          };
          
          this.isLoading.productCategory = false;
          this.initializeProductCategoryChart();
        },
        error: (error: Error) => {
          console.error('Error fetching product category performance:', error);
          this.isLoading.productCategory = false;
          this.hasError.productCategory = true;
        }
      });
  }

  private initializeStoreCategoryChart() {
    const canvas = document.getElementById('storeCategoryCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.storeCategoryChart) {
      this.storeCategoryChart.destroy();
    }
    
    this.storeCategoryChart = new Chart(canvas, {
      type: 'pie',
      data: this.storeCategoryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                family: "'Poppins', sans-serif",
                size: 12
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          title: {
            display: true,
            text: this.hasError.storeCategory ? 'Store Category Distribution (Mock Data)' : 'Store Category Distribution',
            font: {
              family: "'Poppins', sans-serif",
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 30
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
                const percentage = Math.round((value as number / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }

  private initializeFeedbackChart() {
    const canvas = document.getElementById('feedbackCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.feedbackChart) {
      this.feedbackChart.destroy();
    }
    
    this.feedbackChart = new Chart(canvas, {
      type: 'bar',
      data: this.feedbackData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            max: 5,
            grid: {
              display: true,
              color: 'rgba(200, 200, 200, 0.2)'
            },
            ticks: {
              font: {
                family: "'Poppins', sans-serif"
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Poppins', sans-serif"
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: this.hasError.feedback ? 'Store Feedback Analysis (Mock Data)' : 'Store Feedback Analysis',
            font: {
              family: "'Poppins', sans-serif",
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 30
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.raw !== undefined ? Number(context.raw) : 0;
                return `${label}: ${value.toFixed(1)}/5.0`;
              }
            }
          }
        }
      }
    });
  }

  private initializeProductStatusChart() {
    const canvas = document.getElementById('productStatusCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.productStatusChart) {
      this.productStatusChart.destroy();
    }
    
    this.productStatusChart = new Chart(canvas, {
      type: 'doughnut',
      data: this.productStatusData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                family: "'Poppins', sans-serif",
                size: 12
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          title: {
            display: true,
            text: this.hasError.productStatus ? 'Product Status Distribution (Mock Data)' : 'Product Status Distribution',
            font: {
              family: "'Poppins', sans-serif",
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 30
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
                const percentage = Math.round((value as number / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%',
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }

  private initializeProductCategoryChart() {
    const canvas = document.getElementById('productCategoryCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.productCategoryChart) {
      this.productCategoryChart.destroy();
    }
    
    this.productCategoryChart = new Chart(canvas, {
      type: 'bar',
      data: this.productCategoryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Poppins', sans-serif"
              },
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(200, 200, 200, 0.2)'
            },
            ticks: {
              font: {
                family: "'Poppins', sans-serif"
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: this.hasError.productCategory ? 'Top Product Category Performance (Mock Data)' : 'Top Product Category Performance',
            font: {
              family: "'Poppins', sans-serif",
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 30
            }
          }
        }
      }
    });
  }

  // Helper methods
  private formatCategoryName(category: string): string {
    return category
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  private formatStatusName(status: string): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  private generateColorArray(length: number): string[] {
    const baseColors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)',
      'rgba(78, 205, 196, 0.8)',
      'rgba(255, 99, 255, 0.8)'
    ];
    
    const colorArray = [];
    for (let i = 0; i < length; i++) {
      colorArray.push(baseColors[i % baseColors.length]);
    }
    
    return colorArray;
  }
}
