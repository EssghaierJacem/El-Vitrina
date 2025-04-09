import { Component } from '@angular/core';
import { Formation } from 'src/app/core/models/formation/formation.model';
import { FormationService } from 'src/app/core/services/formation/formationService';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-formation-list',
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: './formation-list.component.html',
  styleUrl: './formation-list.component.scss'
})
export class FormationListComponent {
  formations: Formation[] = [];
  isLoading = true;

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe((data: Formation[]) => {
      this.formations = data;
      this.isLoading = false;
    });
  }

}
