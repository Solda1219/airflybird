import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { HorizonLayoutComponent } from './containers/horizon-layout/horizon-layout.component';

import { P404Component } from './view/error/404.component';
import { P500Component } from './view/error/500.component';
import { LoginComponent } from './view/login/login.component';
import { AuthGuard } from './service/auth.guard';
import { ModalsComponent } from './views/notifications/modals.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'modal',
    component: ModalsComponent
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: HorizonLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./view/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'device',
        loadChildren: () => import('./view/device/device.module').then(m => m.DeviceModule)
      },
      {
        path: 'video',
        loadChildren: () => import('./view/video/video.module').then(m => m.VideoModule)
      },
      {
        path: 'detect',
        loadChildren: () => import('./view/detect/detect.module').then(m => m.DetectModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./view/account/account.module').then(m => m.AccountModule)
      },
      {
        path: 'equipment',
        loadChildren: () => import('./view/equipment/equipment.module').then(m => m.EquipmentModule)
      },
    ]
  },
  {
    path: 'monitor',
    canActivate: [AuthGuard],
    loadChildren: () => import('./view/monitor/monitor.module').then(m => m.MonitorModule)
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
