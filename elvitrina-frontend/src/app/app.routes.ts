import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FrontComponent } from './layouts/frontoffice/front.component';
import { FullComponent } from './layouts/full/full.component';
import { AdminGuard } from './main-components/user/adminGuard.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { OauthSuccessComponent } from './main-components/user/oauth-success/oauth-success.component';
import { RequestPersoCreateComponent } from './main-components/requestPerso/frontOffice/request-perso-create/request-perso-create.component';
import { chartRoutes } from './main-components/chart-ines/chart/charts-routes';
import { HomeComponent } from './layouts/frontoffice/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: FrontComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'home',
        redirectTo: '', pathMatch: 'full'
      },
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
      {
        path: 'payment',
        loadChildren: () =>
          import('./main-components/Payment/frontoffice/payment.routes').then((m) => m.PaymentsRoutes),
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./main-components/custom-order/Frontoffice/custom-order-Front.routes').then(m => m.CustomOrderFrontRoutes),
      },
      {
       path: 'quiz',
         loadChildren: () =>
          import('./main-components/Quiz/frontoffice/quizFront.routes').then((m) => m.QuizFrontRoutes),
},

      {
        path: 'requestperso',
        loadChildren: () =>
          import('./main-components/requestPerso/frontOffice/frontoffice_requestPerso.routes').then((m) => m.RequestPersoCreate),
      },
      {
        path: 'AdCreate',
        loadChildren: () =>
          import('./main-components/Ad/frontOffice/frontoffice_ad.routes').then((m) => m.AdCreate),
      },
      {
        path: 'RequestGenerate',
        loadChildren: () =>
          import('./main-components/threedgeneration/threedgeneration.routes').then((m) => m.RequestGenerate),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./main-components/blogPost/frontoffice/frontoffice_blogPost.routes').then((m) => m.BlogPostRoutes),
      },


      {
        path: 'formation',
        loadChildren: () =>
          import('./main-components/formation/frontoffice/frontoffice_formation.routes').then((m) => m.FormationRoutes),
      },

      {
        path: 'events',
        loadChildren: () =>
          import('./main-components/event/frontoffice/eventfront.routes').then((m) => m.EVENT_FRONT_ROUTES),
      },



      {
        path: 'donations',
        loadChildren: () =>
          import('./main-components/donation/frontoffice/donationfront.routes').then((m) => m.DONATION_FRONT_ROUTES),
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
 // canActivate: [AdminGuard],
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
          import('./main-components/custom-order/backOffice/custom-order.routes').then(m => m.customOrderRoutes),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('./main-components/Payment/backoffice/payment.routes').then(m => m.PaymentRoutes),
      },
      {
        path: 'quiz',
        loadChildren: () =>
          import('./main-components/Quiz/backoffice/quiz.routes').then(m => m.QuizRoutes),
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
        path: 'charts',
        loadChildren: () =>
          import('./main-components/chart-ines/chart/charts-routes')
            .then(m => m.chartRoutes)
      },

      {
        path: 'formations',
        loadChildren: () =>
          import('./main-components/formation/backoffice/backoffice_formation.routes')
            .then(m => m.FormationRoutes)
      },


      {
        path: 'blogPosts',
        loadChildren: () =>
          import('./main-components/blogPost/backoffice/backoffice_blogPost.routes')
            .then(m => m.BlogPostRoutes)
      },

      {
        path: 'RequestPerso',
        loadChildren: () =>
          import('./main-components/requestPerso/BackOffice/backoffice_requestPerso.routes').then((m) => m.AdminRequests),
      },
      {
        path: 'AdAdmin',
        loadChildren: () =>
          import('./main-components/Ad/backOffice/backoffice_ad.routes').then((m) => m.AdAdmin),
      },

      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      {
        path: 'donations',
        loadChildren: () =>
          import('./main-components/donation/backoffice/donationback.routes').then((m) => m.DONATION_BACK_ROUTES),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./main-components/event/backoffice/eventback.routes').then((m) => m.EVENT_BACK_ROUTES),
      },
    ],
  },
  {
    path: 'oauth-success',
    component: OauthSuccessComponent
  },
  {
    path: '**', component: NotFoundComponent
  },
];
