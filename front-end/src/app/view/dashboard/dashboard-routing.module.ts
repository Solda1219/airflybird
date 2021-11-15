import { DashboardMessageComponent } from './dashboard-message/dashboard-message.component';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ReportTripComponent } from '../dashboard/report-trip/report-trip.component';
import { ReportViolationComponent } from '../dashboard/report-violation/report-violation.component';
import { ReportOverspeedComponent } from '../dashboard/report-overspeed/report-overspeed.component';
import { ReportParkingComponent } from '../dashboard/report-parking/report-parking.component';
import { ReportIdlingComponent } from '../dashboard/report-idling/report-idling.component';
import { ReportIgnitionComponent } from '../dashboard/report-ignition/report-ignition.component';
import { ReportOverviewComponent } from './report-overview/report-overview.component';
import { ReportOnlineComponent } from './report-online/report-online.component';
import { ReportOfflineComponent } from './report-offline/report-offline.component';
import { ReportAlertComponent } from './report-alert/report-alert.component';
import { ReportAlertDetailComponent } from './report-alert-detail/report-alert-detail.component';
import { DriveBehaviourComponent } from './drive-behaviour/drive-behaviour.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, data: { title: 'Dashboard'},
    children: [
      { path: '',redirectTo: 'account'},
      { path: 'account',component: DashboardIndexComponent},
      { path: 'message',component: DashboardMessageComponent},
      { path: 'motion-static/trip',component: ReportTripComponent},
      { path: 'device-static/violation',component: ReportViolationComponent},
      { path: 'motion-static/overspeed',component: ReportOverspeedComponent},
      { path: 'motion-static/parking',component: ReportParkingComponent},
      { path: 'motion-static/idling',component: ReportIdlingComponent},
      { path: 'motion-static/ignition',component: ReportIgnitionComponent},
      { path: 'motion-static/overview',component: ReportOverviewComponent},
      { path: 'state-static/online',component: ReportOnlineComponent},
      { path: 'state-static/offline',component: ReportOfflineComponent},
      { path: 'device-static/drive-behaviour',component: DriveBehaviourComponent},
      { path: 'alert/report',component: ReportAlertComponent},
      { path: 'alert/detail',component: ReportAlertDetailComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
