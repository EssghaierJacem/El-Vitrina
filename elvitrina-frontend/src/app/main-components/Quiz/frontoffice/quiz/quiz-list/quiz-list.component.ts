import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 Ajoute ceci

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})
export class QuizListComponent  implements OnInit {
  quizzes: Quiz[] = [];

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizService.getAllQuizzes().subscribe(data => {
      this.quizzes = data;
    });
  }

}
