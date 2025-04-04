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
    iconName: 'feedback',
    route: '/dashboard/app-feedback',
  },
  {
    displayName: 'Store Feedback',
    iconName: 'feedback',
    route: '/dashboard/store-feedback',
  },
  {
    navCap: 'Store',
  },
  {
    displayName: 'Store',
    iconName: 'store',
    route: '/dashboard/stores',
  },
  {
    navCap: 'Products',
  },
  {
    displayName: 'Product',
    iconName: 'shopping-cart',
    route: '/dashboard/products',
  },
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
    iconName: 'point',
    route: '/dashboard/offers',
  }, 

  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'archive',
    route: 'dashboard/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'info-circle',
    route: 'dashboard/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list-details',
    route: 'dashboard/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'file-text',
    route: 'dashboard/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'file-text-ai',
    route: 'dashboard/ui-components/tooltips',
  },
  {
    displayName: 'Forms',
    iconName: 'clipboard-text',
    route: 'dashboard/ui-components/forms',
  },
  {
    displayName: 'Tables',
    iconName: 'table',
    route: 'dashboard/ui-components/tables',
  },

  {
    navCap: 'Pages',
  },

  {
    displayName: 'Roll Base Access',
    iconName: 'lock-access',
    route: 'https://modernize-angular-main.netlify.app/apps/permission',
    external: true,
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Treeview',
    iconName: 'git-merge',
    route: 'https://modernize-angular-main.netlify.app/theme-pages/treeview',
    external: true,
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
  },

  {
    navCap: 'Extra',
  },

  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    route: 'dashboard/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'brand-dribbble',
    route: 'dashboard/extra/sample-page',
  },

  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication',
    children: [
      {
        displayName: 'Login',
        iconName: 'point',
        route: '/authentication/login',
      },
      {
        displayName: 'Side Login',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white', 
        chipContent: 'PRO',
        route: 'https://modernize-angular-main.netlify.app/authentication/login',
      },
    ],
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication',
    children: [
      {
        displayName: 'Register',
        iconName: 'point',
        route: '/authentication/register',
      },
      {
        displayName: 'Side Register',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
        route: 'https://modernize-angular-main.netlify.app/authentication/side-register',
      },
    ],
  },
  {
    displayName: 'Forgot Pwd',
    iconName: 'rotate',
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Forgot Pwd',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
        route: 'https://modernize-angular-main.netlify.app/authentication/side-forgot-pwd',
      },
      {
        displayName: 'Boxed Forgot Pwd',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
        route: 'https://modernize-angular-main.netlify.app/authentication/boxed-forgot-pwd',
      },
    ],
  },
  {
    displayName: 'Two Steps',
    iconName: 'zoom-code',
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Two Steps',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
        route: 'https://modernize-angular-main.netlify.app/authentication/side-two-steps',
      },
      {
        displayName: 'Boxed Two Steps',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
        route: 'https://modernize-angular-main.netlify.app/authentication/boxed-two-steps',
      },
    ],
  },
  {
    displayName: 'Error',
    iconName: 'alert-circle',
    route: 'https://modernize-angular-main.netlify.app//authentication/error',
    external: true,
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Maintenance',
    iconName: 'settings',
    route: 'https://modernize-angular-main.netlify.app//authentication/maintenance',
    external: true,
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
  },
];
