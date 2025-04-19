import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-view',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './quiz-view.component.html',
  styleUrl: './quiz-view.component.scss'
})
export class QuizViewComponent implements OnInit {
  quiz: Quiz | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private quizService: QuizService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');  // Récupérer l'id du quiz dans l'URL
    if (quizId) {
      const idAsNumber = parseInt(quizId, 10);  // Convertir l'id en nombre
      if (!isNaN(idAsNumber)) {
        this.getQuizById(idAsNumber);  // Appeler la méthode pour récupérer le quiz
      } else {
        console.error('L\'ID du quiz n\'est pas valide');
      }
    }
  }

  getQuizById(id: number): void {
    this.quizService.getQuizById(id).subscribe({
      next: (quiz: Quiz) => {
        this.quiz = quiz;  // Assigner le quiz récupéré à la variable `quiz`
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du quiz:', err);
      }
    });
  }
  }
