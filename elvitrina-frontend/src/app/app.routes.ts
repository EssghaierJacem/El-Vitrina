import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FrontComponent } from './layouts/frontoffice/front.component';
import { FullComponent } from './layouts/full/full.component';
import { AdminGuard } from './main-components/user/adminGuard.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
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
      {
        path: 'users',
        loadChildren: () =>
          import('./main-components/user/frontoffice/frontuser.routes').then((m) => m.FrontUserRoutes),
      },
      {
        path: 'stores',
        loadChildren: () =>
          import('./main-components/store/frontOffice/store.routes').then((m) => m.routes),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./main-components/product/frontOffice/product.routes').then((m) => m.ProductRoutes),
      },
      {
        path: 'friends',
        loadChildren: () =>
          import('./main-components/friends/friend.routes').then((m) => m.FriendRoutes),
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
    path: '**', component: NotFoundComponent
  },
];
