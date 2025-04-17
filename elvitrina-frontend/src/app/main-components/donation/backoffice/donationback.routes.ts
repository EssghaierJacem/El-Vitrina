import { Routes } from '@angular/router';

// Donation components
import { DonationListComponent } from './donation/donation-list/donation-list.component';
import { DonationCreateComponent } from './donation/donation-create/donation-create.component';
import { DonationDetailsComponent } from './donation/donation-details/donation-details.component';
import { DonationEditComponent } from './donation/donation-edit/donation-edit.component';

// Campaign components
import { CampaignListComponent } from './campaign/campaign-list/campaign-list.component';
import { CampaignCreateComponent } from './campaign/campaign-create/campaign-create.component';
import { CampaignDetailsComponent } from './campaign/campaign-details/campaign-details.component';
import { CampaignEditComponent } from './campaign/campaign-edit/campaign-edit.component';

// Reward components
import { RewardListComponent } from './reward/reward-list/reward-list.component';
import { RewardCreateComponent } from './reward/reward-create/reward-create.component';
import { RewardDetailsComponent } from './reward/reward-details/reward-details.component';
import { RewardEditComponent } from './reward/reward-edit/reward-edit.component';

export const DONATION_BACK_ROUTES: Routes = [
  {
    path: '',
    children: [
      // Donations
      {
        path: 'donations',
        component: DonationListComponent,
        data: {
          title: 'Donations',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Donations', url: '' }
          ]
        }
      },
      {
        path: 'donations/create',
        component: DonationCreateComponent,
        data: {
          title: 'Create Donation',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Donations', url: '/dashboard/donations' },
            { label: 'Create', url: '' }
          ]
        }
      },
      {
        path: 'donations/:id',
        component: DonationDetailsComponent,
        data: {
          title: 'Donation Details',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Donations', url: '/dashboard/donations' },
            { label: 'Details', url: '' }
          ]
        }
      },
      {
        path: 'donations/edit/:id',
        component: DonationEditComponent,
        data: {
          title: 'Edit Donation',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Donations', url: '/dashboard/donations' },
            { label: 'Edit', url: '' }
          ]
        }
      },

      // Campaigns
      {
        path: 'campaigns',
        component: CampaignListComponent,
        data: {
          title: 'Campaigns',
        }
      },
      {
        path: 'campaigns/create',
        component: CampaignCreateComponent,
        data: {
          title: 'Create Campaign',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Campaigns', url: '/dashboard/campaigns' },
            { label: 'Create', url: '' }
          ]
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
      {
        path: 'campaigns/edit/:id',
        component: CampaignEditComponent,
        data: {
          title: 'Edit Campaign',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Campaigns', url: '/dashboard/campaigns' },
            { label: 'Edit', url: '' }
          ]
        }
      },

      // Rewards
      {
        path: 'rewards',
        component: RewardListComponent,
        data: {
          title: 'Rewards',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Rewards', url: '' }
          ]
        }
      },
      {
        path: 'rewards/create',
        component: RewardCreateComponent,
        data: {
          title: 'Create Reward',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Rewards', url: '/dashboard/rewards' },
            { label: 'Create', url: '' }
          ]
        }
      },
      {
        path: 'rewards/:id',
        component: RewardDetailsComponent,
        data: {
          title: 'Reward Details',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Rewards', url: '/dashboard/rewards' },
            { label: 'Details', url: '' }
          ]
        }
      },
      {
        path: 'rewards/edit/:id',
        component: RewardEditComponent,
        data: {
          title: 'Edit Reward',
          breadcrumb: [
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Rewards', url: '/dashboard/rewards' },
            { label: 'Edit', url: '' }
          ]
        }
      }
    ]
  }
];
