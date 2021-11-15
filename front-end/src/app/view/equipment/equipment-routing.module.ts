import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentComponent } from './equipment.component';
import { EqCameraComponent } from './eq-camera/eq-camera.component';
import { EqGpuComponent } from './eq-gpu/eq-gpu.component';
import { EqFtpComponent } from './eq-ftp/eq-ftp.component';
import { EqMediaComponent } from './eq-media/eq-media.component';

const routes: Routes = [
  {
    path: '', component: EquipmentComponent, data: { title: 'Equipment'},
    children: [ 
      { path: '',redirectTo: 'camera'},
      { path: 'camera',component: EqCameraComponent},
      { path: 'gpu',component: EqGpuComponent},
      { path: 'ftp',component: EqFtpComponent},
      { path: 'media',component: EqMediaComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule {
}
