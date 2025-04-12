// user-view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user/UserService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/core/models/user/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ]
})
export class UserViewComponent implements OnInit {
  userId!: number;
  user?: User;
  isLoading = true;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.isLoading = false;
      }
    });
  }
}