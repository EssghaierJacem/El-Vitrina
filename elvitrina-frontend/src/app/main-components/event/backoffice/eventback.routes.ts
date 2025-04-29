import { Routes } from '@angular/router';
import { EventBackListComponent } from './event-back-list/event-back.component';

// Front office components


export const EVENT_BACK_ROUTES: Routes = [
  {
    path: '',
    children: [
      // Events
      {
        path: 'eventback',
        component: EventBackListComponent,
        data: {
          title: 'Events',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Events', url: '' }
          ]
        }
      },
   

      // Sessions
     
      
     
    ]
  }
];