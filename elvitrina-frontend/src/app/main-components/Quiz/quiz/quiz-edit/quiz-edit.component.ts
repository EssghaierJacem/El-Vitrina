import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/core/services/Quiz/QuizService';
import { Quiz } from 'src/app/core/models/Quiz/quiz';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';  // Pour ngModel

import { MatInputModule } from '@angular/material/input';  // Pour matInput
import { MatButtonModule } from '@angular/material/button';  // Pour les boutons
import { MatCardModule } from '@angular/material/card';  // Pour mat-card
import { MatSelectModule } from '@angular/material/select';  // Pour mat-select (si nécessaire)
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-quiz-edit',
  imports: [
 
     FormsModule,  // Pour ngModel
     MatInputModule,  // Pour matInput
      MatButtonModule,  // Pour les boutons
      MatCardModule,  // Pour mat-card
      MatSelectModule,  // Pour mat-select
      MatOptionModule],
  templateUrl: './quiz-edit.component.html',
  styleUrl: './quiz-edit.component.scss'
})
export class QuizEditComponent implements OnInit {

 quiz: Quiz = {
  id: 0,
  title: '',
  description: '',
  score: 0,
  userId: 0,
};

constructor(
  private quizService: QuizService,
  private router: Router,
  private route: ActivatedRoute
) {}

ngOnInit(): void {
  // Récupérer l'ID du quiz à éditer depuis l'URL
  const quizId = +this.route.snapshot.paramMap.get('id')!;

  // Charger le quiz avec l'ID récupéré
  this.quizService.getQuizById(quizId).subscribe((quiz) => {
    this.quiz = quiz;
  });
}

editQuiz(form: NgForm) {
  if (form.valid) {
    this.quizService.updateQuiz(this.quiz).subscribe({
      next: (response) => {
        console.log('Quiz mis à jour avec succès:', response);
        this.router.navigate(['/quizzes']); // Redirection après la mise à jour
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du quiz:', error);
      }
    });
  }
}

}
