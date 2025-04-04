import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FrontComponent } from './layouts/frontoffice/front.component';
import { FullComponent } from './layouts/full/full.component';
import { AdminGuard } from './main-components/user/adminGuard.component';

export const routes: Routes = [
  {
    path: '',
    component: FrontComponent,
    children: [
      {
        path: 'offers',
        loadChildren: () =>
          import('./main-components/offer/frontoffice/frontoffice_offer.routes').then((m) => m.FrontOfferRoutes),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./main-components/user/frontoffice/frontuser.routes').then((m) => m.FrontUserRoutes),
      },
    ],
  },
  {
    path: 'authentication',
    component: BlankComponent,
    loadChildren: () =>
      import('./pages/authentication/authentication.routes').then(
        (m) => m.AuthenticationRoutes
      ),
  },
  {
    path: 'dashboard', 
    component: FullComponent,
    canActivate: [AdminGuard], 
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
        path: 'app-feedback',
        loadChildren: () =>
          import('./main-components/appFeedback/backOffice/app-feedback.routes').then(m => m.AppFeedbackRoutes),
      },
      {
        path: 'store-feedback',
        loadChildren: () =>
          import('./main-components/storeFeedback/backOffice/store-feedback.routes')
            .then(m => m.StoreFeedbackRoutes)
      },
      {
        path: 'stores',
        loadChildren: () =>
          import('./main-components/store/backOffice/store.routes')
            .then(m => m.StoreRoutes)
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./main-components/product/backOffice/product.routes')
            .then(m => m.ProductRoutes)
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
