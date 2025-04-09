import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/core/models/Quiz/question';
import { QuestionType } from 'src/app/core/models/Quiz/question-type';
import { QuestionService } from 'src/app/core/services/Quiz/QuestionService';

@Component({
  selector: 'app-quiz-play',
  imports: [CommonModule,FormsModule],
  templateUrl: './quiz-play.component.html',
  styleUrl: './quiz-play.component.scss'
})
export class QuizPlayComponent implements OnInit {
  questions: Question[] = [];
  responses: { [key: number]: any } = {};
  questionType = QuestionType;

  constructor(private route: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit(): void {
    const quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.questionService.getQuestionsByQuizId(quizId).subscribe((data) => {
      this.questions = data;
    });
  }

  onSubmit() {
    console.log("Réponses utilisateur :", this.responses);
    // Tu peux envoyer ça au backend ici
  }
  updateMultiChoice(qId: number, option: string, event: any) {
    if (!this.responses[qId]) {
      this.responses[qId] = [];
    }
    if (event.target.checked) {
      this.responses[qId].push(option);
    } else {
      this.responses[qId] = this.responses[qId].filter((opt: string) => opt !== option);
    }
  }


}
