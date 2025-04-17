import { Component, OnInit, ViewChild } from '@angular/core';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';  // Pour gérer la table des quizzes
import { MatPaginator } from '@angular/material/paginator';  // Pour la pagination
import { MatSort } from '@angular/material/sort';  // Pour trier les colonnes
import { MatFormFieldModule } from '@angular/material/form-field';  // Pour mat-form-field
import { RouterModule } from '@angular/router';
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
    RouterModule,
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
  displayedColumns: string[] = ['question', 'option1', 'option2', 'option3', 'bonneReponse', 'score', 'actions'];
  dataSource: MatTableDataSource<Quiz> = new MatTableDataSource<Quiz>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: (response) => {
        this.quizzes = response;
        this.dataSource.data = this.quizzes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des quizzes:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }





  deleteQuiz(userId: number): void {
    this.quizService.deleteQuiz(userId).subscribe(
      () => {
        this.quizzes = this.quizzes.filter(quiz => quiz.userId !== userId);
        this.dataSource.data = this.quizzes;
      },
      (error) => {
        console.error('Erreur lors de la suppression du quiz', error);
      }
    );
  }

}
