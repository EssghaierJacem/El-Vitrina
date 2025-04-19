import { Routes } from '@angular/router';

// Donation components


// Campaign components
import { CampaignListComponent } from './campaign/campaign-list/campaign-list.component';
import { CampaignDetailsComponent } from './campaign/campaign-details/campaign-details.component';


// Reward components


export const DONATION_BACK_ROUTES: Routes = [
  {
    path: '',
    children: [
      // Donations
      

      // Campaigns
      {
        path: 'campaigns',
        component: CampaignListComponent,
        data: {
          title: 'Campaigns',
        }
      },
     
      {
        path: 'campaigns/:id',
        component: CampaignDetailsComponent,
        data: {
          title: 'Campaign Details',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Campaigns', url: '/dashboard/campaigns' },
            { label: 'Details', url: '' }
          ]
        }
      },
     

      // Rewards
    
    
    ]
  }
];
