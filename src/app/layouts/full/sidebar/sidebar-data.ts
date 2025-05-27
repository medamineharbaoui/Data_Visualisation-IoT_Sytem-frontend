import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
    {
    displayName: 'Real-Time Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/real-time-dashboard',
  }  ,
    {
    displayName: 'History Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/sensor-data',
  },
      {
    displayName: 'Devices',
    iconName: 'solar:widget-add-line-duotone',
    route: '/devices',
      }
];
