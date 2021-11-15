import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorIndexComponent } from './monitor-index/monitor-index.component';
import { MonitorTripsComponent } from './monitor-trips/monitor-trips.component';
import { MonitorPlaybackComponent } from './monitor-playback/monitor-playback.component';
import { HorizonLayoutComponent } from '../../containers/horizon-layout/horizon-layout.component';

const routes: Routes = [
  {
    path: '',
    component:HorizonLayoutComponent,
    data: {
      title: 'Monitor'
    },
    children: [
      {path: '',redirectTo: 'index'},
      {path: 'index', component: MonitorIndexComponent,data: { title: 'Monitor'} },
    ]
  },
  {path: 'trips/:imei', component: MonitorTripsComponent,data: { title: 'Monitor' }},
  {path: 'mornitortracking/:imei', component: MonitorPlaybackComponent,data: { title: 'Monitor' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorRoutingModule {}
