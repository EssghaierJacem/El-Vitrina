import { Routes } from '@angular/router';

// Front office components
import { EventListComponent } from './event/event-list/event-list.component';
import { EventDetailsComponent } from './event/event-details/event-details.component';
import { EventRegisterComponent } from './event/event-register/event-register.component';

export const EVENT_FRONT_ROUTES: Routes = [
  {
    path: '',
    children: [
      // Events
      {
        path: '',
        component: EventListComponent,
        data: {
          title: 'Events',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Events', url: '' }
          ]
        }
      },
      { path: 'auth-callback', component: EventDetailsComponent },
      {
        path: ':id',
        component: EventDetailsComponent,
        data: {
          title: 'Event Details',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Events', url: '/events' },
            { label: 'Details', url: '' }
          ]
        }
      },
      {
        path: ':id/register',
        component: EventRegisterComponent,
        data: {
          title: 'Register for Event',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Events', url: '/events' },
            { label: 'Register', url: '' }
          ]
        }
      },

      // Sessions
     
      
     
    ]
  }
];