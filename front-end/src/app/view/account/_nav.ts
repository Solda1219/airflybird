export const navItems = [
  {
    name: 'Admin',
    url: '/account/admin',
    role: ['super'],
    icon: 'icon-speedometer'
  },
  {
    name: 'Agent',
    role: ['admin','super'],
    url: '/account/agent',
    icon: 'icon-speedometer'
  },
  {
    name: 'end-user',
    role: ['agent','super','admin'],
    url: '/account/end-user',
    icon: 'icon-speedometer'
  },
];
