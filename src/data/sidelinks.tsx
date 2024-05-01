import {
  IconTruckDelivery,
  IconCategory,
  IconCurrencyDollar,
  IconShirt,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Orders',
    href: '/',
    icon: <IconTruckDelivery size={18} />,
  },
  {
    title: 'Products',
    href: '/products',
    icon: <IconShirt size={18} />,
  },
  {
    title: 'Categories',
    label: '',
    href: '/categories',
    icon: <IconCategory size={18} />,
  },
  {
    title: 'Delivery Pricing',
    label: '',
    href: '/deliverypricing',
    icon: <IconCurrencyDollar size={18} />,
  },
]
