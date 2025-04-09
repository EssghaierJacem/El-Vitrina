
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Formation } from 'src/app/core/models/formation/formation.model';
import { FormationService } from 'src/app/core/services/formation/formationService';
import { MatCardModule } from '@angular/material/card';  // MatCard pour l'affichage de la carte
import { MatButtonModule } from '@angular/material/button'; 

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // Pour la gestion des routes
import { MatIconModule } from '@angular/material/icon'; 


@Component({
  selector: 'app-formation-details',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],  templateUrl: './formation-details.component.html',
  styleUrl: './formation-details.component.scss'
})
export class FormationDetailsComponent {


@Component({
  selector: 'app-formation-details',
  templateUrl: './formation-details.component.html',
  styleUrls: ['./formation-details.component.scss']
})
  formation: Formation;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    const formationId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchFormationDetails(formationId);
  }

  fetchFormationDetails(id: number): void {
    this.formationService.getFormationById(id).subscribe({
      next: (formation) => {
        this.formation = formation;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  enroll(): void {
    // Logic to enroll the user
    alert('You have successfully enrolled in the course!');
  }
}

