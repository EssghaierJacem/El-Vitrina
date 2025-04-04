import { Routes } from '@angular/router';
import { AppFeedbackListComponent } from './app-feedback-list/app-feedback-list.component';
import { AppFeedbackCreateComponent } from './app-feedback-create/app-feedback-create.component';
import { AppFeedbackDetailsComponent } from './app-feedback-details/app-feedback-details.component';
import { AppFeedbackEditComponent } from './app-feedback-edit/app-feedback-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AppFeedbackListComponent,
    data: {
      title: 'App Feedback',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
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
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'App Feedback', url: '/dashboard/app-feedback' },
        { label: 'Create', url: '' }
      ]
    }
  },
  {
    path: 'edit/:id',
    component: AppFeedbackEditComponent,
    data: {
      title: 'Edit App Feedback',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'App Feedback', url: '/dashboard/app-feedback' },
        { label: 'Edit', url: '' }
      ]
    }
  },
  {
    path: ':id',
    component: AppFeedbackDetailsComponent,
    data: {
      title: 'Feedback Details',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'App Feedback', url: '/dashboard/app-feedback' },
        { label: 'Details', url: '' }
      ]
    }
  }
];

export const AppFeedbackRoutes = routes;