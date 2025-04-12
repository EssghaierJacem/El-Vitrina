import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/core/services/Quiz/QuestionService';
import { Question } from 'src/app/core/models/Quiz/question';
import { QuestionType } from 'src/app/core/models/Quiz/question-type';
import { NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-edit',
  imports:  [
      FormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        CommonModule
      ],
  templateUrl: './question-edit.component.html',
  styleUrl: './question-edit.component.scss'
})
export class QuestionEditComponent   implements OnInit {
  question: Question = {
    id: 0,
    question: '',
    questionType: QuestionType.SINGLECHOICE, // Valeur par défaut
    quizId: 0
  };

  questionTypes = Object.values(QuestionType);

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.questionService.getQuestionById(id).subscribe({
        next: (response) => {
          this.question = response;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération de la question :", error);
        }
      });
    }
  }

  editQuestion(form: NgForm): void {
    if (form.valid) {
      this.questionService.updateQuestion(this.question.id!, this.question).subscribe({
        next: () => {
          console.log('Question mise à jour avec succès.');
          this.router.navigate(['/dashboard/question/list']);
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour :", error);
        }
      });
    }


  }}


