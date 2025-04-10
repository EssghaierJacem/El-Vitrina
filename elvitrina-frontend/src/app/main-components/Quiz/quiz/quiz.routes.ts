import { Routes } from '@angular/router';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizCreateComponent } from './quiz-create/quiz-create.component';

export const QuizRoutes: Routes = [
  { path: 'list', component: QuizListComponent },
  { path: 'create', component: QuizCreateComponent },
];
