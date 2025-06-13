import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  {
    heading: 'General',
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
        link: '/trx/work-order',
      },
      {
        title: 'Purchase Order',
        icon: 'i-lucide-file-text',
        link: '/trx/purchase-order',
      },
      {
        title: 'Surat Jalan',
        icon: 'i-lucide-truck',
        link: '/trx/surat-jalan',
      },
    ],
  },
  {
    heading: 'Warehouse & Inventory',
    items: [
      // {
      //   title: 'Incoming DO (Surat Jalan)',
      //   icon: 'i-lucide-truck',
      //   link: '/warehouse/surat-jalan',
      // },
      {
        title: 'Quality Control',
        icon: 'i-lucide-flask-conical',
        link: '/warehouse/quality-control',
      },
      {
        title: 'Inventory In (Stock In)',
        icon: 'i-lucide-file-check',
        link: '/warehouse/inventory-in',
      },
      {
        title: 'Inventory Out',
        icon: 'i-lucide-log-out',
        link: '/warehouse/inventory-out',
      },
      {
        title: 'Stock Adjustment',
        icon: 'i-lucide-sliders-horizontal',
        link: '/warehouse/stock-adjustment',
      },
      {
        title: 'Stock Summary',
        icon: 'i-lucide-warehouse',
        link: '/report/stock-summary',
      },
    ],
  },
  {
    heading: 'Employee',
    items: [
      {
        title: 'Karywawan',
        icon: 'i-lucide-users',
        link: '/settings/users',
      },
    ],
  },
  {
    heading: 'Master Data',
    items: [
      {
        title: 'Branch',
        icon: 'i-lucide-map-pin',
        link: '/branch',
      },
      {
        title: 'Area Kerja',
        icon: 'i-lucide-layout-grid',
        link: '/area-kerja',
      },
      {
        title: 'Jabatan',
        icon: 'i-lucide-badge-check',
        link: '/jabatan',
      },
      {
        title: 'Gudang',
        icon: 'i-lucide-warehouse',
        link: '/gudang',
      },
      {
        title: 'Container',
        icon: 'i-lucide-package',
        link: '/container',
      },
    ],
  },
  {
    heading: 'Settings',
    items: [
      {
        title: 'Account',
        icon: 'i-lucide-circle',
        link: '/settings/account',
      },
      {
        title: 'Role',
        icon: 'i-lucide-user-cog',
        link: '/settings/role',
      },
      {
        title: 'Permission',
        icon: 'i-lucide-key',
        link: '/settings/permission',
      },
      {
        title: 'Role Permission',
        icon: 'i-lucide-shield-check',
        link: '/settings/role-permission',
      },
      {
        title: 'Users',
        icon: 'i-lucide-users',
        link: '/settings/users',
      },
      {
        title: 'Workflow',
        icon: 'i-lucide-workflow',
        link: '/settings/workflow',
      },
      // {
      //   title: 'Workflow New',
      //   icon: 'i-lucide-workflow',
      //   link: '/settings/workflow/new',
      // },
    ],
  }
]

export const navMenuBottom: NavMenuItems = [
  {
    title: 'Help & Support',
    icon: 'i-lucide-circle-help',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
]
