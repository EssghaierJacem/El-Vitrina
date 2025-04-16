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
  confirmationMessage = '';
  showResults = false; // Ajoute une variable pour gérer l'affichage des résultats

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
    // Vérifier la dernière question
    const lastQuestionAnswered = !!this.selectedAnswers[this.quizzes.length - 1];
    return this.quizzes.length > 0 && lastQuestionAnswered && this.quizzes.every((_, index) => !!this.selectedAnswers[index]);
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
    console.log('Réponse sélectionnée :', answer);  // Ajoute cette ligne pour vérifier

    const currentQuiz = this.quizzes[this.currentQuestionIndex];
    const questionId = currentQuiz?.id;
    console.log('questionId:', questionId);  // Ajoute cette ligne pour vérifier

    this.selectedAnswers[this.currentQuestionIndex] = answer;

    if (questionId !== undefined) {
      this.submitAnswer(questionId, answer);
    } else {
      console.log('questionId est undefined');
    }
  }
  submitAnswer(quizId: number, userAnswer: string): void {
    console.log('Envoi de la réponse...', quizId, userAnswer);  // Ajoute cette ligne pour vérifier

    // Appelle l'API pour envoyer la réponse
    this.quizService.saveUserAnswer(quizId, userAnswer).subscribe({
      next: (res) => {
        this.confirmationMessage = '✅ Réponse enregistrée !';
        console.log('✅ Réponse enregistrée:', res);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'envoi de la réponse', err);
      }
    });
  }



  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService.getAllQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.quizzes = this.quizzes.map((quiz, index) => ({
          ...quiz,
          id: quiz.id ?? index + 1  // Si l'ID est manquant, on attribue un ID basé sur l'index (1-based)
        }));

        console.log('Quizzes reçus:', this.quizzes);
        this.isLoading = false;
        this.quizzes.forEach(quiz => {
          if (!quiz.id) {
            console.log('ID manquant pour cette question:', quiz);
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des quizzes';
        this.isLoading = false;
        console.error(err);
      }
    });

  }
  showQuizResults() {
    this.showResults = true;
    this.showQuestion = false; // Masque les questions une fois que les résultats sont affichés
  }
  restartQuiz() {
    this.showResults = false;
    this.showQuestion = true;
    this.currentQuestionIndex = 0;
    this.selectedAnswers = {};
    this.startTimer();
  }

}
