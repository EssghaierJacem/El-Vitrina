import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/core/services/Quiz/QuestionService';
import { Question } from 'src/app/core/models/Quiz/question';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.scss']
})
export class ListQuestionComponent implements OnInit {
  questions: Question[] = [];

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: (response) => {
        console.log('Questions récupérées:', response);  // Ajouter ceci pour vérifier la réponse
        this.questions = response;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des questions :', error);
      }
    });
  }

}
