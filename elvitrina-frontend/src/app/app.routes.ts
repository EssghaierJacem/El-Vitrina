import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FrontComponent } from './layouts/frontoffice/front.component';
import { FullComponent } from './layouts/full/full.component';
import { customOrderRoutes } from './main-components/custom-order/custom-order.routes';
import { Question } from './core/models/Quiz/question';

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
        path: 'custom-order',
        loadChildren: () =>
          import('./main-components/custom-order/custom-order.routes').then(m => m.customOrderRoutes),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('./main-components/Payment/payment.routes').then(m => m.PaymentRoutes),
      },
      {
        path: 'quiz',
        loadChildren: () =>
          import('./main-components/Quiz/quiz/quiz.routes').then(m => m.QuizRoutes),
      },
      {
        path: 'question',
        loadChildren: () =>
          import('./main-components/Quiz/question/question.routes').then(m => m.QuestionRoutes),
      },
      {
        path: 'reponse',
        loadChildren: () =>
          import('./main-components/Quiz/reponse/reponse.routes').then(m => m.ReponseRoutes),
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
    path: '**',
    redirectTo: 'authentication/error',
  },
];
