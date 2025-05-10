import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablerIconsModule } from 'angular-tabler-icons';
import { User } from 'src/app/core/models/user/user.model';

interface TopUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  points: number;
  image: string;
}

interface Month {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-product-performance',
  templateUrl: './product-performance.component.html',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    FormsModule
  ],
})
export class AppProductPerformanceComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'user', 'points', 'status']; 
  dataSource: TopUser[] = [];
  readonly IMAGE_BASE_URL = '/api/user-images/';


  months: Month[] = [
    { value: 'mar', viewValue: 'March 2025' },
    { value: 'apr', viewValue: 'April 2025' },
    { value: 'june', viewValue: 'June 2025' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopUsers();
  }

  loadTopUsers(): void {
    this.http.get<TopUser[]>('/api/api/stats/top-users').subscribe({
      next: (data) => {
        this.dataSource = data.slice(0, 4);
      },
      error: (err) => {
        console.error('Failed to fetch top users', err);
      }
    });
  }

    getUserImage(user: User): string {
      if (!user || !user.image) {
        return '/assets/images/default-avatar.png';
      }
    
      if (user.image.startsWith('http')) {
        return user.image;
      }
    
      return this.IMAGE_BASE_URL + user.image;
    }  
}
