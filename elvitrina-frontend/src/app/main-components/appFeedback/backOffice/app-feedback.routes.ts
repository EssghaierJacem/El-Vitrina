import { Routes } from '@angular/router';
import { AppFeedbackListComponent } from './app-feedback-list/app-feedback-list.component';
import { AppFeedbackCreateComponent } from './app-feedback-create/app-feedback-create.component';
import { AppFeedbackDetailsComponent } from './app-feedback-details/app-feedback-details.component';
import { AppFeedbackEditComponent } from './app-feedback-edit/app-feedback-edit.component';

export const APP_FEEDBACK_ROUTES: Routes = [
  {
    path: '',
    component: AppFeedbackListComponent,
    data: {
      title: 'App Feedback',
      breadcrumb: [
        { label: 'Home', url: '/backoffice' },
        { label: 'Feedback', url: '/backoffice/feedback' },
        { label: 'App Feedback', url: '' }
      ]
    }
  },
  {
    path: 'create',
    component: AppFeedbackCreateComponent,
    data: {
      title: 'Create App Feedback',
      breadcrumb: [
        { label: 'Home', url: '/backoffice' },
        { label: 'Feedback', url: '/backoffice/feedback' },
        { label: 'App Feedback', url: '/backoffice/app-feedback' },
        { label: 'Create', url: '' }
      ]
    }
  },
  {
    path: ':id',
    component: AppFeedbackDetailsComponent,
    data: {
      title: 'Feedback Details',
      breadcrumb: [
        { label: 'Home', url: '/backoffice' },
        { label: 'Feedback', url: '/backoffice/feedback' },
        { label: 'App Feedback', url: '/backoffice/app-feedback' },
        { label: 'Details', url: '' }
      ]
    }
  },
  {
    path: ':id/edit',
    component: AppFeedbackEditComponent,
    data: {
      title: 'Edit App Feedback',
      breadcrumb: [
        { label: 'Home', url: '/' },
        { label: 'Feedback', url: '/feedback' },
        { label: 'App Feedback', url: '/app-feedback' },
        { label: 'Edit', url: '' }
      ]
    }
  }
];