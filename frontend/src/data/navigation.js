// src/data/navigation.js
// Central navigation config — used by Sidebar and mobile nav

export const navItems = [
  {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    description: 'Overview & insights',
    exact: true,
  },
  {
    id: 'recommend',
    label: 'Crop Advisor',
    path: '/recommend',
    icon: 'Sprout',
    description: 'AI crop recommendations',
    badge: 'AI',
    badgeColor: 'leaf',
  },
  {
    id: 'diagnosis',
    label: 'Disease Scan',
    path: '/diagnosis',
    icon: 'ScanLine',
    description: 'Upload & detect diseases',
    badge: 'New',
    badgeColor: 'harvest',
  },
  {
    id: 'weather',
    label: 'Weather',
    path: '/weather',
    icon: 'CloudSun',
    description: 'Forecast & alerts',
  },
  {
    id: 'market',
    label: 'Market Prices',
    path: '/market',
    icon: 'TrendingUp',
    description: 'Live mandi & commodity rates',
  },
  {
    id: 'schemes',
    label: 'Govt Schemes',
    path: '/schemes',
    icon: 'BadgeIndianRupee',
    description: 'Subsidies & eligibility',
    badge: '15+',
    badgeColor: 'harvest',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    description: 'Yield & soil trends',
  },
]

export const bottomNavItems = [
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
  },
]

export const quickStats = [
  { label: 'Scans today',    value: '24',   unit: '',   trend: '+12%', up: true },
  { label: 'Healthy crops',  value: '87',   unit: '%',  trend: '+3%',  up: true },
  { label: 'Alerts active',  value: '3',    unit: '',   trend: '-2',   up: false },
  { label: 'Rainfall (7d)',  value: '42',   unit: 'mm', trend: 'Normal', up: true },
]