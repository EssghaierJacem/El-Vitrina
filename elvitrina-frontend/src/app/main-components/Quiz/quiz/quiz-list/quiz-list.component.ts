import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';  // Pour gérer la table des quizzes
import { MatPaginator } from '@angular/material/paginator';  // Pour la pagination
import { MatSort } from '@angular/material/sort';  // Pour trier les colonnes
import { MatFormFieldModule } from '@angular/material/form-field';  // Pour mat-form-field
import { MatInputModule } from '@angular/material/input';  // Pour matInput
import { MatTableModule } from '@angular/material/table';  // Pour afficher les tableaux
import { MatPaginatorModule } from '@angular/material/paginator';  // Pour la pagination
import { MatSortModule } from '@angular/material/sort';  // Pour le tri
import { MatCardModule } from '@angular/material/card';  // Pour mat-card
@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule   ,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ]
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  displayedColumns: string[] = ['title', 'description', 'score', 'actions'];  // Colonnes à afficher dans la table
  dataSource: MatTableDataSource<Quiz> = new MatTableDataSource<Quiz>(this.quizzes);

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    // Charger tous les quizzes lors de l'initialisation du composant
    this.quizService.getAllQuizzes().subscribe({
      next: (response) => {
        this.quizzes = response;
        this.dataSource = new MatTableDataSource(this.quizzes);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des quizzes:', error);
      }
    });
  }

  // Pour gérer la pagination
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Rediriger vers le formulaire d'édition du quiz
  editQuiz(id: number): void {
    this.router.navigate([`/quiz-edit/${id}`]);
  }
}
