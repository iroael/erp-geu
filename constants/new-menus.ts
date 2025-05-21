import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  {
    heading: 'Monitoring',
    items: [
      {
        title: 'Dashboard',
        icon: 'i-lucide-home',
        link: '/',
      },
    ],
  },
  {
    heading: 'Transaction',
    items: [
      {
        title: 'Work Order',
        icon: 'i-lucide-file-check',
        link: '/trx/work-order/index',
      },
      {
        title: 'PO',
        icon: 'i-lucide-file-text',
        link: '/transaction/po',
      },
      {
        title: 'Surat Jalan',
        icon: 'i-lucide-truck',
        link: '/transaction/surat-jalan',
      },
    ],
  },
  {
    heading: 'Warehouse & Inventory',
    items: [
      {
        title: 'Dashboard',
        icon: 'i-lucide-warehouse',
        link: '/warehouse',
      },
    ],
  },
  {
    heading: 'Master Data',
    items: [
      {
        title: 'Branch',
        icon: 'i-lucide-building-2',
        link: '/branch',
      },
      {
        title: 'Jabatan',
        icon: 'i-lucide-building-2',
        link: '/jabatan',
      },
      {
        title: 'Gudang',
        icon: 'i-lucide-building-2',
        link: '/gudang',
      },
    ],
  },
  {
    heading: 'Settings',
    items: [

      {
        title: 'User Management',
        icon: 'i-lucide-users',
        children: [
          {
            title: 'Role',
            icon: 'i-lucide-circle',
            link: '/user-management/role',
          },
          {
            title: 'Permission',
            icon: 'i-lucide-circle',
            link: '/user-management/permission',
          },
          {
            title: 'Role Permission',
            icon: 'i-lucide-circle',
            link: '/user-management/role-permission',
          },
          {
            title: 'Account',
            icon: 'i-lucide-circle',
            link: '/user-management/account',
          },
        ],
      },
      {
        title: 'Authentication',
        icon: 'i-lucide-lock-keyhole-open',
        children: [
          {
            title: 'Login',
            icon: 'i-lucide-circle',
            link: '/login',
          },
          {
            title: 'Login Basic',
            icon: 'i-lucide-circle',
            link: '/login-basic',
          },
          {
            title: 'Register',
            icon: 'i-lucide-circle',
            link: '/register',
          },
          {
            title: 'Forgot Password',
            icon: 'i-lucide-circle',
            link: '/forgot-password',
          },
        ],
      },
      {
        title: 'Errors',
        icon: 'i-lucide-triangle-alert',
        children: [
          {
            title: '401 - Unauthorized',
            icon: 'i-lucide-circle',
            link: '/401',
          },
          {
            title: '403 - Forbidden',
            icon: 'i-lucide-circle',
            link: '/403',
          },
          {
            title: '404 - Not Found',
            icon: 'i-lucide-circle',
            link: '/404',
          },
          {
            title: '500 - Internal Server Error',
            icon: 'i-lucide-circle',
            link: '/500',
          },
          {
            title: '503 - Service Unavailable',
            icon: 'i-lucide-circle',
            link: '/503',
          },
        ],
      },
      {
        title: 'Settings',
        icon: 'i-lucide-settings',
        new: true,
        children: [
          {
            title: 'Profile',
            icon: 'i-lucide-circle',
            link: '/settings/profile',
          },
          {
            title: 'Account',
            icon: 'i-lucide-circle',
            link: '/settings/account',
          },
          {
            title: 'Appearance',
            icon: 'i-lucide-circle',
            link: '/settings/appearance',
          },
          {
            title: 'Notifications',
            icon: 'i-lucide-circle',
            link: '/settings/notifications',
          },
          {
            title: 'Display',
            icon: 'i-lucide-circle',
            link: '/settings/display',
          },
        ],
      },
    ],
  },

  {
    heading: 'General',
    items: [
      {
        title: 'Dashboard',
        icon: 'i-lucide-home',
        link: '/',
      },
      {
        title: 'Email',
        icon: 'i-lucide-mail',
        link: '/email',
      },
      {
        title: 'Tasks',
        icon: 'i-lucide-calendar-check-2',
        link: '/tasks',
        new: true,
      },
    ],
  },
  {
    heading: 'Components',
    items: [
      {
        title: 'Components',
        icon: 'i-lucide-component',
        children: [
          // ... Komponen lainnya tidak diubah ...
          {
            title: 'Skeleton',
            icon: 'i-lucide-circle',
            link: '/components/skeleton',
          },
          {
            title: 'Stepper',
            icon: 'i-lucide-circle',
            link: '/components/stepper',
            new: true,
          },
          {
            title: 'Switch',
            icon: 'i-lucide-circle',
            link: '/components/switch',
          },
          {
            title: 'Table',
            icon: 'i-lucide-circle',
            link: '/components/table',
          },
          {
            title: 'Tabs',
            icon: 'i-lucide-circle',
            link: '/components/tabs',
          },
          {
            title: 'Tags Input',
            icon: 'i-lucide-circle',
            link: '/components/tags-input',
          },
          {
            title: 'Textarea',
            icon: 'i-lucide-circle',
            link: '/components/textarea',
          },
          {
            title: 'Toast',
            icon: 'i-lucide-circle',
            link: '/components/toast',
          },
          {
            title: 'Toggle',
            icon: 'i-lucide-circle',
            link: '/components/toggle',
          },
          {
            title: 'Toggle Group',
            icon: 'i-lucide-circle',
            link: '/components/toggle-group',
          },
          {
            title: 'Tooltip',
            icon: 'i-lucide-circle',
            link: '/components/tooltip',
          },
        ],
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems = [
  {
    title: 'Help & Support',
    icon: 'i-lucide-circle-help',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
  {
    title: 'Feedback',
    icon: 'i-lucide-send',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
]
