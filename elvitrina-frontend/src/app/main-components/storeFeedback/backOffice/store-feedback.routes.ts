import { Routes } from '@angular/router';
import { StoreFeedbackListComponent } from './store-feedback-list/store-feedback-list.component';
import { StoreFeedbackCreateComponent } from './store-feedback-create/store-feedback-create.component';
import { StoreFeedbackDetailsComponent } from './store-feedback-details/store-feedback-details.component';
import { StoreFeedbackEditComponent } from './store-feedback-edit/store-feedback-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: StoreFeedbackListComponent,
    data: {
      title: 'Store Feedback',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Store Feedback', url: '' }
      ]
    }
  },
  {
    path: 'create',
    component: StoreFeedbackCreateComponent,
    data: {
      title: 'Create Store Feedback',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Store Feedback', url: '/dashboard/store-feedback' },
        { label: 'Create', url: '' }
      ]
    }
  },
  {
    path: 'edit/:id',
    component: StoreFeedbackEditComponent,
    data: {
      title: 'Edit Store Feedback',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Store Feedback', url: '/dashboard/store-feedback' },
        { label: 'Edit', url: '' }
      ]
    }
  },
  {
    path: ':id',
    component: StoreFeedbackDetailsComponent,
    data: {
      title: 'Feedback Details',
      breadcrumb: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Store Feedback', url: '/dashboard/store-feedback' },
        { label: 'Details', url: '' }
      ]
    }
  }
];

export const StoreFeedbackRoutes = routes;