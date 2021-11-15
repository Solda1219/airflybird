import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectComponent } from './detect.component';
import { DetectStatusComponent } from './detect-status/detect-status.component';
import { AppStatusComponent } from './app-status/app-status.component';
import { VodStatusComponent } from './vod-status/vod-status.component';

const routes: Routes = [
  {
    path: '', component: DetectComponent, data: { title: 'Detect'},
    children: [ 
      { path: '',redirectTo: 'app'},
      { path: 'status',component: DetectStatusComponent},
      { path: 'app', component: AppStatusComponent},
      { path: 'vod', component: VodStatusComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetectRoutingModule {}
