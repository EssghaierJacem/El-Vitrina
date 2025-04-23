import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Formation } from 'src/app/core/models/formation/formation.model';
import { FormationService } from 'src/app/core/services/formation/formationService';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-formation-details',
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './formation-details.component.html',
  styleUrl: './formation-details.component.scss',
  standalone: true // Ajouté car vous utilisez les imports directement dans le composant
})
export class FormationDetailsComponent implements OnInit {
  formation: Formation;
  isLoading: boolean = true;
  enrolledFormations: Formation[] = [];

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    const formationId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchFormationDetails(formationId);
    this.loadEnrolledFormations();
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

  loadEnrolledFormations(): void {
    // Charge les formations déjà inscrites depuis le localStorage
    const enrolled = localStorage.getItem('enrolledFormations');
    if (enrolled) {
      this.enrolledFormations = JSON.parse(enrolled);
      
      // Si vous voulez éviter les doublons
      this.enrolledFormations = this.enrolledFormations.filter(
        (formation, index, self) => 
          index === self.findIndex(f => f.id === formation.id)
      );
    }
  }

  getCategoryImage(category: string): string {
    const categoryImages: { [key: string]: string } = {
      'HANDMADE': 'assets/category/1.png',
      'COOKING': 'assets/category/2.png',
      'SEWING': 'assets/category/3.png',
      'POTTERY': 'assets/category/4.png',
    };
    return categoryImages[category] || 'assets/categories/default.jpg';
  }

  enroll(): void {
    if (!this.formation) return;
  
    // Vérifie si la formation est déjà dans la liste
    const index = this.enrolledFormations.findIndex(f => f.id === this.formation.id);
  
    if (index !== -1) {
      // Si déjà enrôlé, on le retire
      this.enrolledFormations.splice(index, 1);
      localStorage.setItem('enrolledFormations', JSON.stringify(this.enrolledFormations));
      alert('You have been unenrolled from this course');
    } else {
      // Sinon on l'ajoute
      this.enrolledFormations.push(this.formation);
      localStorage.setItem('enrolledFormations', JSON.stringify(this.enrolledFormations));
      alert('You have successfully enrolled in this course!');
    }
  }

  // Méthode pour vérifier si la formation actuelle est déjà inscrite
  isAlreadyEnrolled(): boolean {
    if (!this.formation) return false;
    return this.enrolledFormations.some(f => f.id === this.formation.id);
  }
}