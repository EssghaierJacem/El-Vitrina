import { Component, OnInit } from '@angular/core';
import { Formation } from 'src/app/core/models/formation/formation.model';
import { FormationService } from 'src/app/core/services/formation/formationService';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'; // Pour mat-form-field
import { MatInputModule } from '@angular/material/input'; // Pour matInput

@Component({
  selector: 'app-formation-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './formation-list.component.html',
  styleUrls: ['./formation-list.component.scss']
})
export class FormationListComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = []; // Tableau pour stocker les formations filtrées
  isLoading = true;
  searchQuery = ''; // Requête de recherche

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe((data: Formation[]) => {
      this.formations = data;
      this.filteredFormations = this.formations; // Initialise la liste filtrée avec toutes les formations
      this.isLoading = false;
    });
  }

  // Fonction pour récupérer l'image de catégorie
  getCategoryImage(category: string): string {
    const categoryImages: { [key: string]: string } = {
      'HANDMADE': 'assets/category/1.png',
      'COOKING': 'assets/category/2.png',
      'SEWING': 'assets/category/3.png',
      'POTTERY': 'assets/category/4.png',
      // Ajoute d'autres catégories ici
    };
    return categoryImages[category] || 'assets/category/default.png'; // Image par défaut si catégorie non trouvée
  }

  // Fonction pour filtrer les formations en fonction de la requête de recherche
  onSearchChange(): void {
    if (this.searchQuery.trim()) {
      this.filteredFormations = this.formations.filter(formation => 
        formation.courseTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        formation.formationCategory.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredFormations = this.formations; // Si la recherche est vide, afficher toutes les formations
    }
  }
}
