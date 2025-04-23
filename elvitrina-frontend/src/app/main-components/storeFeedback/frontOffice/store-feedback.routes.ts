import { Routes } from '@angular/router';
import { StoreFeedbackListComponent } from './store-feedback-list/store-feedback-list.component';
import { StoreFeedbackCreateComponent } from './store-feedback-create/store-feedback-create.component';

export const storeFeedbackRoutes: Routes = [
  {
    path: 'store-feedback',
    component: StoreFeedbackListComponent,
    data: {
      title: 'Store Feedback'
    }
  },
  {
    path: 'store-feedback/create',
    component: StoreFeedbackCreateComponent,
    data: {
      title: 'Create Store Feedback'
    }
  }
];
