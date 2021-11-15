export const navItems = [
  {
    name: 'Account details',
    role:[],
    url: '/dashboard/account',
    icon: 'icon-speedometer'
  },
  {
    name: 'Motion Statistics',
    role:[],
    icon: 'icon-speedometer',
    url: '/dashboard/motion-static',
    is_collapse:false,
    child:[
      {
        name: 'Overview',
        role:[],
        url: '/dashboard/motion-static/overview',
        icon: 'icon-speedometer'
      },
      {
        name: 'Trip',
        role:[],
        url: '/dashboard/motion-static/trip',
        icon: 'icon-speedometer'
      },
      {
        name: 'Overspeed',
        role:[],
        url: '/dashboard/motion-static/overspeed',
        icon: 'icon-speedometer'
      },
      {
        name: 'Parking',
        role:[],
        url: '/dashboard/motion-static/parking',
        icon: 'icon-speedometer'
      },
      {
        name: 'Idling',
        role:[],
        url: '/dashboard/motion-static/idling',
        icon: 'icon-speedometer'
      },
      {
        name: 'Ignition',
        role:[],
        url: '/dashboard/motion-static/ignition',
        icon: 'icon-speedometer'
      },
    ]
  },
  {
    name: 'State Statistics',
    url:'/dashboard/state-static',
    role:[],
    icon: 'icon-speedometer',
    is_collapse:false,
    child:[
      {
        name: 'Online',
        role:[],
        url: '/dashboard/state-static/online',
        icon: 'icon-speedometer'
      },
      {
        name: 'Offline',
        role:[],
        url: '/dashboard/state-static/offline',
        icon: 'icon-speedometer'
      },
    ]
  },  
  {
    name: 'Device Statistics',
    role:[],
    url:'/dashboard/device-static',
    icon: 'icon-speedometer',
    is_collapse:false,
    child:[
      {
        name: 'Driving behaviour',
        role:[],
        url: '/dashboard/device-static/drive-behaviour',
        icon: 'icon-speedometer'
      },
      {
        name: 'Violation',
        role:[],
        url: '/dashboard/device-static/violation',
        icon: 'icon-speedometer'
      },
    ]
  },
  {
    name: 'Messages',
    role:[],
    url: '/dashboard/message',
    icon: 'icon-speedometer'
  },
  {
    name: 'Alert',
    role:[],
    url: '/dashboard/alert',
    icon: 'icon-speedometer',
    is_collapse:false,
    child:[
      {
        name: 'Report of alert',
        role:[],
        url: '/dashboard/alert/report',
        icon: 'icon-speedometer'
      },
      {
        name: 'Alert details',
        role:[],
        url: '/dashboard/alert/detail',
        icon: 'icon-speedometer'
      },
    ]
  },
];
