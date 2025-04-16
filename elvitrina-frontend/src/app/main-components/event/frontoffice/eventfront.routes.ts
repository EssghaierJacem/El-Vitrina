import { Routes } from '@angular/router';

// Front office components
import { EventListComponent } from './event/event-list/event-list.component';
import { EventDetailsComponent } from './event/event-details/event-details.component';
import { EventRegisterComponent } from './event/event-register/event-register.component';
import { SessionListComponent } from './session/session-list/session-list.component';
import { SessionDetailsComponent } from './session/session-details/session-details.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './ticket/ticket-details/ticket-details.component';

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
      {
        path: '/:id',
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
        path: '/:id/register',
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
      {
        path: '/:eventId/sessions',
        component: SessionListComponent,
        data: {
          title: 'Event Sessions',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Events', url: '/events' },
            { label: 'Sessions', url: '' }
          ]
        }
      },
      {
        path: '/:eventId/sessions/:id',
        component: SessionDetailsComponent,
        data: {
          title: 'Session Details',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Events', url: '/events' },
            { label: 'Sessions', url: `/events/:id/sessions` },
            { label: 'Details', url: '' }
          ]
        }
      },

      // Tickets
      {
        path: 'my-tickets',
        component: TicketListComponent,
        data: {
          title: 'My Tickets',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'My Account', url: '/account' },
            { label: 'My Tickets', url: '' }
          ]
        }
      },
      {
        path: 'my-tickets/:id',
        component: TicketDetailsComponent,
        data: {
          title: 'Ticket Details',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'My Tickets', url: '/my-tickets' },
            { label: 'Details', url: '' }
          ]
        }
      }
    ]
  }
];