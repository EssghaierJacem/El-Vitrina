import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuizResultComponent } from '../quiz-result/quiz-result.component';

@Component({
  selector: 'app-quiz-strat',
  imports: [RouterModule],
  templateUrl: './quiz-strat.component.html',
  styleUrl: './quiz-strat.component.scss'
})
export class QuizStratComponent {
  title = 'quizard';

}
