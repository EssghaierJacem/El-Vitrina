import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FrontComponent } from './layouts/frontoffice/front.component';
import { FullComponent } from './layouts/full/full.component';
import { UserTableComponent } from './main-components/user/user-table/user-table.component';
import { APP_FEEDBACK_ROUTES } from './main-components/appFeedback/backOffice/app-feedback.routes';

export const routes: Routes = [
  {
    path: '',
    component: FrontComponent, 
    children: [    
    ],
  },

  {
    path: 'dashboard', 
    component: FullComponent, 
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./main-components/user/user.routes').then(m => m.UserRoutes),
      },
      {
        path: 'offers',
        loadChildren: () =>
          import('./main-components/offer/backoffice/backoffice_offer.routes').then(m => m.OfferRoutes),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full'
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },

  {
    path: 'app-feedback',
    children: APP_FEEDBACK_ROUTES,
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
