import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';

@Component({
  selector: 'app-quiz-list',
  imports: [],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})
export class QuizListComponent   implements OnInit {
  quizzes: Quiz[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private quizService: QuizService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService.getAllQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des quizzes';
        this.isLoading = false;
        console.error(err);
      }
    });
  }}
