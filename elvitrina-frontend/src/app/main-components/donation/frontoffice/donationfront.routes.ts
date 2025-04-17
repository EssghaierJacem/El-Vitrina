import { Routes } from '@angular/router';



// Campaign components
import { CampaignListComponent } from './campaign/campaign-list/campaign-list.component';
import { CampaignDetailsComponent } from './campaign/campaign-details/campaign-details.component';
import { CampaignDonateComponent } from './campaign/campaign-donate/campaign-donate.component';


// Gift components
import { GiftListComponent } from './gift/gift-list/gift-list.component';
import { GiftDetailsComponent } from './gift/gift-details/gift-details.component';
import { GiftEditComponent } from './gift/gift-edit/gift-edit.component';
import { GiftRedeemComponent } from './gift/gift-redeem/gift-redeem.component';
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
        path: 'gifts',
        component: GiftListComponent,
        data: {
          title: 'My Gifts',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'My Gifts', url: '' }
          ]
        }
      },
      {
        path: 'gifts/:id',
        component: GiftDetailsComponent,
        data: {
          title: 'Gift Details',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'My Gifts', url: '/gifts' },
            { label: 'Details', url: '' }
          ]
        }
      },
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
      {
        path: 'gifts/:id/edit',
        component: GiftEditComponent,
        data: {
          title: 'Edit Gift',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'My Gifts', url: '/gifts' },
            { label: 'Edit', url: '' }
          ]
        }
      },
      {
        path: 'gifts/:id/redeem',
        component: GiftRedeemComponent,
        data: {
          title: 'Redeem Gift',
          breadcrumb: [
            { label: 'Home', url: '/' },
            { label: 'My Gifts', url: '/gifts' },
            { label: 'Redeem', url: '' }
          ]
        }
      }
    ]
  }
];