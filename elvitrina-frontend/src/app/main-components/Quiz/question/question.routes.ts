
import { Routes } from '@angular/router';
import { QuestionCreateComponent } from './question-create/question-create.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionEditComponent } from './question-edit/question-edit.component';
import { QuestionViewComponent } from './question-view/question-view.component';


export const QuestionRoutes: Routes = [
  { path: 'list', component: QuestionListComponent },
  { path: 'create', component: QuestionCreateComponent },
  { path: 'edit/:id', component: QuestionEditComponent},
  { path: 'view/:id', component:QuestionViewComponent}
];
