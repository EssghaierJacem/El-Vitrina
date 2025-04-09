import { Routes } from '@angular/router';

// Event components
import { EventListComponent } from './event/event-list/event-list.component';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { EventDetailsComponent } from './event/event-details/event-details.component';
import { EventEditComponent } from './event/event-edit/event-edit.component';

// Session components
import { SessionListComponent } from './session/session-list/session-list.component';
import { SessionCreateComponent } from './session/session-create/session-create.component';
import { SessionDetailsComponent } from './session/session-details/session-details.component';
import { SessionEditComponent } from './session/session-edit/session-edit.component';

// Participant components
import { ParticipantListComponent } from './participant/participant-list/participant-list.component';
import { ParticipantDetailsComponent } from './participant/participant-details/participant-details.component';

export const EVENT_BACK_ROUTES: Routes = [
  {
    path: '',
    children: [
      // Events
      {
        path: 'events',
        component: EventListComponent,
        data: {
          title: 'Events',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '' }
          ]
        }
      },
      {
        path: 'events/create',
        component: EventCreateComponent,
        data: {
          title: 'Create Event',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Create', url: '' }
          ]
        }
      },
      {
        path: 'events/:id',
        component: EventDetailsComponent,
        data: {
          title: 'Event Details',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Details', url: '' }
          ]
        }
      },
      {
        path: 'events/edit/:id',
        component: EventEditComponent,
        data: {
          title: 'Edit Event',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Edit', url: '' }
          ]
        }
      },

      // Sessions
      {
        path: 'events/:eventId/sessions',
        component: SessionListComponent,
        data: {
          title: 'Event Sessions',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Sessions', url: '' }
          ]
        }
      },
      {
        path: 'events/:eventId/sessions/create',
        component: SessionCreateComponent,
        data: {
          title: 'Create Session',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Sessions', url: `/dashboard/events/:id/sessions` },
            { label: 'Create', url: '' }
          ]
        }
      },
      {
        path: 'events/:eventId/sessions/:id',
        component: SessionDetailsComponent,
        data: {
          title: 'Session Details',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Sessions', url: `/dashboard/events/:id/sessions` },
            { label: 'Details', url: '' }
          ]
        }
      },
      {
        path: 'events/:eventId/sessions/edit/:id',
        component: SessionEditComponent,
        data: {
          title: 'Edit Session',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Sessions', url: `/dashboard/events/:id/sessions` },
            { label: 'Edit', url: '' }
          ]
        }
      },

      // Participants
      {
        path: 'events/:eventId/participants',
        component: ParticipantListComponent,
        data: {
          title: 'Event Participants',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Participants', url: '' }
          ]
        }
      },
      {
        path: 'events/:eventId/participants/:id',
        component: ParticipantDetailsComponent,
        data: {
          title: 'Participant Details',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Events', url: '/dashboard/events' },
            { label: 'Participants', url: `/dashboard/events/:id/participants` },
            { label: 'Details', url: '' }
          ]
        }
      }
    ]
  }
];