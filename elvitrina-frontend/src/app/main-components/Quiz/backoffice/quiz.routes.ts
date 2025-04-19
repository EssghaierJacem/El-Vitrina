import { Routes } from '@angular/router';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizCreateComponent } from './quiz-create/quiz-create.component';
import { QuizEditComponent } from './quiz-edit/quiz-edit.component';
import { QuizViewComponent } from './quiz-view/quiz-view.component';

export const QuizRoutes: Routes = [
  { path: 'list', component: QuizListComponent },
  { path: 'create', component: QuizCreateComponent },
  { path: 'edit/:id', component: QuizEditComponent},
  { path: 'view/:id', component: QuizViewComponent}
];
