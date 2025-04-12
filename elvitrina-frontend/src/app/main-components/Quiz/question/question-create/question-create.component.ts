import { Component } from '@angular/core';
import { QuestionService } from 'src/app/core/services/Quiz/QuestionService';
import { Question } from 'src/app/core/models/Quiz/question';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { QuestionType } from 'src/app/core/models/Quiz/question-type';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-question-create',
  imports: [
    FormsModule,
      RouterModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      CommonModule,
      MatSelectModule,
      MatButtonModule],
  templateUrl: './question-create.component.html',
  styleUrl: './question-create.component.scss'
})
export class QuestionCreateComponent {
  question: Question = {
    id: 0,
    question: '',
    questionType: QuestionType.SINGLECHOICE,  // Valeur par défaut
    quizId: 0
  };

  questionTypes = Object.values(QuestionType);  // Convertir l'enum en tableau de valeurs

  constructor(private questionService: QuestionService, private router: Router) {}

  createQuestion(form: NgForm) {
    if (form.valid) {
      this.questionService.createQuestion(this.question).subscribe({
        next: (response) => {
          console.log('Question créée avec succès:', response);
          this.router.navigate(['/dashboard/questions/list']); // Redirection vers la liste des questions
        },
        error: (error) => {
          console.error('Erreur lors de la création de la question:', error);
        }
      });
    }
  }
  }


