import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from 'src/app/core/services/Quiz/QuestionService';
import { Question } from 'src/app/core/models/Quiz/question';
import { QuestionType } from 'src/app/core/models/Quiz/question-type';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-question-list',
  imports: [
      FormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent implements OnInit {
questions: Question[] = [];

constructor(private questionService: QuestionService) {}

ngOnInit(): void {
  this.loadQuestions();
}

loadQuestions(): void {
  this.questionService.getAllQuestions().subscribe({
    next: (response) => {
      this.questions = response;
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des questions :', error);
    }
  });
}

deleteQuestion(id: number): void {
  if (confirm('Voulez-vous vraiment supprimer cette question ?')) {
    this.questionService.deleteQuestion(id).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id !== id);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression :', error);
      }
    });
  }
}

}
