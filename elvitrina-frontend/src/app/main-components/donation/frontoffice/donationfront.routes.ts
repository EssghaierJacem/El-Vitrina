import { Routes } from '@angular/router';



// Campaign components
import { CampaignListComponent } from './campaign/campaign-list/campaign-list.component';
import { CampaignDetailsComponent } from './campaign/campaign-details/campaign-details.component';
import { CampaignDonateComponent } from './campaign/campaign-donate/campaign-donate.component';


// Gift components
import { CampaignCreateComponent } from './campaign/campaign-create/campaign-create.component';
import { GiftCreateComponent } from './gift/gift-create/gift-create.component';

export const DONATION_FRONT_ROUTES: Routes = [
  {
    path: '',
    children: [
      
      
      {
        path: 'campaigns/create',
        component: CampaignCreateComponent,
        data: {
          title: 'Create Donation',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Donations', url: '/donations' },
            { label: 'Create', url: '' }
          ]
        }
      },

      // Campaigns
      {
        path: 'campaigns',
        component: CampaignListComponent,
        data: {
          title: 'Campaigns',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Campaigns', url: '' }
          ]
        }
      },
      {
        path: 'campaigns/:id',
        component: CampaignDetailsComponent,
        data: {
          title: 'Campaign Details',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Campaigns', url: '/campaigns' },
            { label: 'Details', url: '' }
          ]
        }
      },
      {
        path: 'campaigns/:id/donate',
        component: CampaignDonateComponent,
        data: {
          title: 'Donate to Campaign',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'Campaigns', url: '/campaigns' },
            { label: 'Donate', url: '' }
          ]
        }
      },

    

      // Gifts
    
      {
        path: 'gifts/create',
        component: GiftCreateComponent,
        data: {
          title: 'Create Gift',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'My Gifts', url: '/gifts' },
            { label: 'Create', url: '' }
          ]
        }
      },
      
  
    ]
  }
];