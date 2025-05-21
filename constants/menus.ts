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
]

export const navMenuBottom: NavMenuItems = [
  {
    title: 'Help & Support',
    icon: 'i-lucide-circle-help',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
]
