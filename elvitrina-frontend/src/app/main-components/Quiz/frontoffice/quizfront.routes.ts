import { Routes } from '@angular/router';
import { QuizListComponent } from './quiz/quiz-list/quiz-list.component';
import { ListQuestionComponent } from '../question/frontoffice/list-question/list-question.component';

export const QuizfrontRoutes: Routes = [
  { path: 'passquiz', component: QuizListComponent },
  { path: 'takequiz', component:ListQuestionComponent }
]



