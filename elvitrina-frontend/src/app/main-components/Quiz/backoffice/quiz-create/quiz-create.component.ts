import { Component } from '@angular/core';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';import { MatFormFieldModule } from '@angular/material/form-field';  // Pour mat-form-field
import { FormsModule } from '@angular/forms';  // Pour ngModel

import { MatInputModule } from '@angular/material/input';  // Pour matInput
import { MatButtonModule } from '@angular/material/button';  // Pour les boutons
import { MatCardModule } from '@angular/material/card';  // Pour mat-card
import { MatSelectModule } from '@angular/material/select';  // Pour mat-select (si nécessaire)
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-quiz-create',
  imports: [
   MatFormFieldModule,
   FormsModule,
   CommonModule ,// Pour ngModel
   MatInputModule,  // Pour matInput
    MatButtonModule,  // Pour les boutons
    MatCardModule,  // Pour mat-card
    MatSelectModule,  // Pour mat-select
    MatOptionModule
  ],
  templateUrl: './quiz-create.component.html',
  styleUrl: './quiz-create.component.scss'
})
export class QuizCreateComponent {
  quiz: Quiz = {
    question: '',
    option1: '',
    option2: '',
    option3: '',
    bonneReponse: '',
    score: 0,
    userId: 1
  };

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {}

  createQuiz(form: NgForm) {
    if (form.valid) {
      this.quizService.createQuiz(this.quiz).subscribe({
        next: (response) => {
          console.log('Quiz créé avec succès:', response);
          this.router.navigate(['/quiz/list']); // Redirige vers la liste
        },
        error: (error) => {
          console.error('Erreur lors de la création du quiz:', error);
        }
      });
    }
  }

}
