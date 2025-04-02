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
    navCap: 'Store',
  },
  {
    displayName: 'Store',
    iconName: 'store',
    route: '/store', // Adjust this route based on your actual routing setup
  },
  {
    navCap: 'Products',
  },
  {
    displayName: 'Product',
    iconName: 'shopping-cart',
    route: '/products',
  },
  {
    navCap: 'Feedback',
  },
  {
    displayName: 'App Feedback',
    iconName: 'feedback',
    route: '/app-feedback',
  },
  {
    displayName: 'Store Feedback',
    iconName: 'feedback',
    route: '/store-feedback',
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
    navCap: 'Apps',
  }, 
  {
    displayName: 'Blog',
    iconName: 'chart-donut-3',
    chip: true,
    chipClass: 'bg-secondary text-white',
    chipContent: 'PRO',
    route: 'apps/blog',
    children: [
      {
        displayName: 'Post',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
        route: 'https://modernize-angular-main.netlify.app/apps/blog/post',
      },
      {
        displayName: 'Detail',
        iconName: 'point',
        external: true,
        chip: true,
        chipClass: 'bg-secondary text-white',
        chipContent: 'PRO',
        route:
          'https://modernize-angular-main.netlify.app/apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
      },
    ],
  },

  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'archive',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'info-circle',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list-details',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'file-text',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'file-text-ai',
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Forms',
    iconName: 'clipboard-text',
    route: '/ui-components/forms',
  },
  {
    displayName: 'Tables',
    iconName: 'table',
    route: '/ui-components/tables',
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
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'brand-dribbble',
    route: '/extra/sample-page',
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
