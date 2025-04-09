
import { Routes } from '@angular/router';
import { QuestionCreateComponent } from './question-create/question-create.component';
import { QuestionListComponent } from './question-list/question-list.component';


export const QuestionRoutes: Routes = [
  { path: 'list', component: QuestionListComponent },
  { path: 'create', component: QuestionCreateComponent },
];
