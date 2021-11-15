import { INavData } from '@coreui/angular';

export const navItems = [
  {
    name: 'Home',
    url: '/dashboard',
    icon: 'icon-speedometer',
    role:[],
  },
  // {
  //   name: 'Report',
  //   url: '/report',
  //   icon: 'cil-chart-line'
  // },
  {
    name: 'Device',
    url: '/device',
    icon: 'cil-car-alt',
    role:[],
  },
  {
    name: 'Monitor',
    url: '/monitor',
    icon: 'cil-monitor',
    role:[],
  },
  {
    name: 'Video',
    icon: 'cil-video',
    url: '/video',
    role:[],
    children:[
      {
        name: 'live',
        url:'/video/live',
        icon:'cil-video'
      },
      {
        name: 'vod',
        url:'/video/vod',
        icon:'cil-video'
      },
      {
        name: 'transfer',
        url:'/video/transfer',
        icon:'cil-video'
      }
    ]
  },
  {
    name: 'Detect',
    url: '/detect',
    icon: 'cil-check-circle',
    role:[],
  },
  {
    name: 'Equipment',
    url: '/equipment',
    icon: 'cil-camera',
    role:['super','admin','agent'],
  },
  {
    name: 'Account',
    url: '/account',
    icon: 'cil-people',
    role:['super','admin','agent'],
  },
];
