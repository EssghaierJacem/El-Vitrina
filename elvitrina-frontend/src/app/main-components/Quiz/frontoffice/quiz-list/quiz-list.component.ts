import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})
export class QuizListComponent   implements OnInit {
  quizzes: Quiz[] = [];
  isLoading = true;
  errorMessage = '';
  showQuestion = false;
  currentQuestionIndex = 0;
  timeLeft: number = 15;
  timer: any;
  selectedAnswers: { [key: number]: string } = {};

  constructor(
    private quizService: QuizService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuizzes();
    this.startTimer ();
  }
  startQuiz() {
    this.showQuestion = true;
  }
  allQuestionsAnswered(): boolean {
    return this.quizzes.length > 0 && this.quizzes.every((_, index) => !!this.selectedAnswers[index]);
  }

  startTimer() {
    this.timeLeft = 60;
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
        this.goToNextQuestion(); // ou afficher "temps écoulé"
      }
    }, 1000);
  }
  goToNextQuestion() {
    clearInterval(this.timer);
    // changer de question
    this.startTimer(); // relancer pour la question suivante
  }
  nextQuestion() {
    if (this.currentQuestionIndex < this.quizzes.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }
  selectAnswer(answer: string): void {
    const questionId = this.quizzes[this.currentQuestionIndex].id;

    this.selectedAnswers[this.currentQuestionIndex] = answer;

    // Save to database (pseudo-code, you might need to adjust for your API)
    // this.quizService.saveUserResponse({
    //   questionId: questionId,
    //   response_user: answer
    // }).subscribe({
    //   next: () => console.log("Response saved"),
    //   error: err => console.error("Error saving response", err)
    // });
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
