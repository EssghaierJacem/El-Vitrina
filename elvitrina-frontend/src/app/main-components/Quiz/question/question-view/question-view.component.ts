import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/core/services/Quiz/QuestionService';
import { Question } from 'src/app/core/models/Quiz/question';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-question-view',
  imports:  [
    FormsModule,
 CommonModule,

      RouterModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule],
  templateUrl: './question-view.component.html',
  styleUrl: './question-view.component.scss'
})
export class QuestionViewComponent implements OnInit {
  question: Question | null = null;

  constructor(private route: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit(): void {
    const questionId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(questionId)) {
      this.getQuestionById(questionId);
    }
  }

  getQuestionById(id: number): void {
    this.questionService.getQuestionById(id).subscribe({
      next: (response) => {
        this.question = response;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la question :', error);
      }
    });
  }

}
