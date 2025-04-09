import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Formation } from 'src/app/core/models/formation/formation.model';
import { MatChipsModule } from '@angular/material/chips';
import { LevelType } from 'src/app/core/models/formation/levelType';
import { User } from 'src/app/core/models/user/user.model';
import { FormationService } from 'src/app/core/services/formation/formationService';
import { FormationCategoryType } from 'src/app/core/models/formation/formationCategoryType';

@Component({
  selector: 'app-formation-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './formation-details.component.html',
  styleUrls: ['./formation-details.component.scss']
})
export class FormationDetailsComponent implements OnInit {
  formation: Formation | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadFormation(id);
    }
  }

  loadFormation(id: number): void {
    this.isLoading = true;
    this.formationService.getFormationById(id).subscribe({
      next: (data) => {
        this.formation = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading formation:', error);
        this.snackBar.open('Error loading formation details', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }
}
