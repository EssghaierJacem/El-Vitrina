import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

interface stats {
    id: number;
    time: string;
    color: string;
    title?: string;
    subtext?: string;
    link?: string;
}

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './recent-transactions.component.html',
})
export class AppRecentTransactionsComponent implements OnInit {
  stats: stats[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/api/stats/recent')
      .subscribe(data => {
        this.stats = data.slice(0, 6).map(activity => ({
          id: activity.id,
          time: activity.time,
          color: activity.color,
          title: activity.title,
          subtext: activity.description, 
          link: activity.link ? activity.link : undefined 
        }));
      });
  }
}
