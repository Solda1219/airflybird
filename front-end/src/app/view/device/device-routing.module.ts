import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceIndexComponent } from './device-index/device-index.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Device'
    },
    children: [
      {
        path: '',
        redirectTo: 'index'
      },
      {
        path: 'index',
        component: DeviceIndexComponent,
        data: {
          title: 'Device'
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule {}
