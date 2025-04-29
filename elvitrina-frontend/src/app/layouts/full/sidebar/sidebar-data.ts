import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },
  {
    navCap: 'Feedback',
  },
  {
    displayName: 'App Feedback',
    iconName: 'help-circle',
    route: '/dashboard/app-feedback',
  },
  {
    displayName: 'Store Feedback',
    iconName: 'heart',
    route: '/dashboard/store-feedback',
  },
  {
    navCap: 'Store and Products',
  },
  {
    displayName: 'Store',
    iconName: 'building-store',
    route: '/dashboard/stores',
  },
  {
    displayName: 'Product',
    iconName: 'shopping-cart',
    route: '/dashboard/products',
  },
  {
    displayName: 'Analytics Dashboard',
    iconName: 'chart-bar',
    route: '/dashboard/charts',
  },
  // {
  //   navCap: 'Charts',
  // },
  // {
  //   displayName: 'Analytics Dashboard',
  //   iconName: 'chart-bar',
  //   route: '/dashboard/charts',
  // },
  // {
  //   displayName: 'Analytical',
  //   iconName: 'aperture',
  //   route: 'https://modernize-angular-main.netlify.app/dashboards/dashboard1',
  //   chip: true,
  //   external: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  // },

  {
    navCap: 'Users and Offers',
  },
  {
    displayName: 'Users',
    iconName: 'user',
    route: '/dashboard/users',
  },
  {
    displayName: 'Offers',
    iconName: 'info-circle',
    route: '/dashboard/offers',
  },
  {
    navCap: 'Order & Payment',
  },
       {
        displayName: 'Order List',
        iconName: 'list',
        route: 'dashboard/custom-order/list',
          },
          {
        displayName: 'Statistiques Overview',
        iconName: 'presentation',
        route: 'dashboard/custom-order/Stat',
          },
          {
        displayName: 'Payment List',
        iconName: 'list',
        route: 'dashboard/payment/list',
           },
    {
      navCap: ' Quiz ',
    },
    {
    displayName: 'Quiz List',
    iconName: 'list',
    route: 'dashboard/quiz/list',
  },
  {
    displayName: 'Create Quiz',
    iconName: 'copy-plus',
    route: 'dashboard/quiz/create',
  },

  {
    navCap: 'Blog & Formation',
  },
  {
    displayName: 'Blog',
    iconName: 'blockquote',
    route: '/dashboard/blogPosts',
  },
  {
    displayName: 'Formation',
    iconName: 'books',
    route: '/dashboard/formations',
  },
  {
    navCap: 'Donations and Events',
  },
  {
    displayName: "Donations",
    iconName: "heart",
    route: "/dashboard/donations/campaigns",
  },
  {
    displayName: 'Events',
    iconName: 'calendar-event',
    route: 'dashboard/events/eventback',
    
  },

  {
    navCap: 'RequestPerso',
  },
  {
    displayName: 'Request',
    iconName: 'point',
    route: '/dashboard/RequestPerso/listrequest',
  },
  {
    displayName: 'PropsalPerso',
    iconName: 'point',
    route: '/dashboard/RequestPerso/listproposal',
  },

  {
    displayName: 'Ads',
    iconName: 'point',
    route: '/dashboard/AdAdmin/admin/ads',
  },

  {
    displayName: 'Stats',
    iconName: 'point',
    route: '/dashboard/RequestPerso/stats',
  }, 
  {
    displayName: 'Moderation',
    iconName: 'point',
    route: '/dashboard/RequestPerso/moderation',
  }, 



  // {
  //   navCap: 'Ui Components',
  // },
  // {
  //   displayName: 'Badge',
  //   iconName: 'archive',
  //   route: 'dashboard/ui-components/badge',
  // },
  // {
  //   displayName: 'Chips',
  //   iconName: 'info-circle',
  //   route: 'dashboard/ui-components/chips',
  // },
  // {
  //   displayName: 'Lists',
  //   iconName: 'list-details',
  //   route: 'dashboard/ui-components/lists',
  // },
  // {
  //   displayName: 'Menu',
  //   iconName: 'file-text',
  //   route: 'dashboard/ui-components/menu',
  // },
  // {
  //   displayName: 'Tooltips',
  //   iconName: 'file-text-ai',
  //   route: 'dashboard/ui-components/tooltips',
  // },
  // {
  //   displayName: 'Forms',
  //   iconName: 'clipboard-text',
  //   route: 'dashboard/ui-components/forms',
  // },
  // {
  //   displayName: 'Tables',
  //   iconName: 'table',
  //   route: 'dashboard/ui-components/tables',
  // },

  // {
  //   navCap: 'Pages',
  // },

  // {
  //   displayName: 'Roll Base Access',
  //   iconName: 'lock-access',
  //   route: 'https://modernize-angular-main.netlify.app/apps/permission',
  //   external: true,
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  // },
  // {
  //   displayName: 'Treeview',
  //   iconName: 'git-merge',
  //   route: 'https://modernize-angular-main.netlify.app/theme-pages/treeview',
  //   external: true,
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  // },

  // {
  //   navCap: 'Extra',
  // },

  // {
  //   displayName: 'Icons',
  //   iconName: 'mood-smile',
  //   route: 'dashboard/extra/icons',
  // },
  // {
  //   displayName: 'Sample Page',
  //   iconName: 'brand-dribbble',
  //   route: 'dashboard/extra/sample-page',
  // },

  // {
  //   navCap: 'Auth',
  // },
  // {
  //   displayName: 'Login',
  //   iconName: 'login',
  //   route: '/authentication',
  //   children: [
  //     {
  //       displayName: 'Login',
  //       iconName: 'point',
  //       route: '/authentication/login',
  //     },
  //     {
  //       displayName: 'Side Login',
  //       iconName: 'point',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //       route: 'https://modernize-angular-main.netlify.app/authentication/login',
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'user-plus',
  //   route: '/authentication',
  //   children: [
  //     {
  //       displayName: 'Register',
  //       iconName: 'point',
  //       route: '/authentication/register',
  //     },
  //     {
  //       displayName: 'Side Register',
  //       iconName: 'point',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //       route: 'https://modernize-angular-main.netlify.app/authentication/side-register',
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Forgot Pwd',
  //   iconName: 'rotate',
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  //   route: '/authentication',
  //   children: [
  //     {
  //       displayName: 'Side Forgot Pwd',
  //       iconName: 'point',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //       route: 'https://modernize-angular-main.netlify.app/authentication/side-forgot-pwd',
  //     },
  //     {
  //       displayName: 'Boxed Forgot Pwd',
  //       iconName: 'point',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //       route: 'https://modernize-angular-main.netlify.app/authentication/boxed-forgot-pwd',
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Two Steps',
  //   iconName: 'zoom-code',
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  //   route: '/authentication',
  //   children: [
  //     {
  //       displayName: 'Side Two Steps',
  //       iconName: 'point',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //       route: 'https://modernize-angular-main.netlify.app/authentication/side-two-steps',
  //     },
  //     {
  //       displayName: 'Boxed Two Steps',
  //       iconName: 'point',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //       route: 'https://modernize-angular-main.netlify.app/authentication/boxed-two-steps',
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Error',
  //   iconName: 'alert-circle',
  //   route: 'https://modernize-angular-main.netlify.app//authentication/error',
  //   external: true,
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  // },
  // {
  //   displayName: 'Maintenance',
  //   iconName: 'settings',
  //   route: 'https://modernize-angular-main.netlify.app//authentication/maintenance',
  //   external: true,
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  // },
];
