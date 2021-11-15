import { CommonModule } from '@angular/common';
import { LanguageTranslationModule } from './../../module/language-translation.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedComponentModule } from './../../shared-component/shared-component.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { QRCodeModule } from 'angularx-qrcode';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';
import { DashboardMessageComponent } from './dashboard-message/dashboard-message.component';
import { DashboardOverviewComponent } from './dashboard-index/dashboard-overview/dashboard-overview.component';
import { ReportIdlingComponent } from '../dashboard/report-idling/report-idling.component';
import { ReportIgnitionComponent } from '../dashboard/report-ignition/report-ignition.component';
import { ReportOverspeedComponent } from '../dashboard/report-overspeed/report-overspeed.component';
import { ReportParkingComponent } from '../dashboard/report-parking/report-parking.component';
import { ReportTripComponent } from '../dashboard/report-trip/report-trip.component';
import { ReportViolationComponent } from '../dashboard/report-violation/report-violation.component';
import { ReportViolationContentComponent } from './report-violation/report-violation-content/report-violation-content.component';
import { ReportTripContentComponent } from './report-trip/report-trip-content/report-trip-content.component';
import { ReportRecordContentComponent } from './report-violation/report-record-content/report-record-content.component';
import { ReportIdlingContentComponent } from './report-idling/report-idling-content/report-idling-content.component';
import { ReportIgnitionContentComponent } from './report-ignition/report-ignition-content/report-ignition-content.component';
import { ReportOverspeedContentComponent } from './report-overspeed/report-overspeed-content/report-overspeed-content.component';
import { ReportParkingContentComponent } from './report-parking/report-parking-content/report-parking-content.component';
import { ReportOverviewComponent } from './report-overview/report-overview.component';
import { ReportOverviewContentComponent } from './report-overview/report-overview-content/report-overview-content.component';
import { ReportOnlineComponent } from './report-online/report-online.component';
import { ReportOnlineContentComponent } from './report-online/report-online-content/report-online-content.component';
import { ReportOfflineComponent } from './report-offline/report-offline.component';
import { ReportOfflineContentComponent } from './report-offline/report-offline-content/report-offline-content.component';
import { ReportAlertComponent } from './report-alert/report-alert.component';
import { ReportAlertDetailComponent } from './report-alert-detail/report-alert-detail.component';
import { ReportAlertContentComponent } from './report-alert/report-alert-content/report-alert-content.component';
import { ReportAlertDetailContentComponent } from './report-alert-detail/report-alert-detail-content/report-alert-detail-content.component';
import { DriveBehaviourComponent } from './drive-behaviour/drive-behaviour.component';
import { DriveBehaviourContentComponent } from './drive-behaviour/drive-behaviour-content/drive-behaviour-content.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    SharedComponentModule,
    ModalModule,
    NgxLoadingModule,
    TabsModule,
    LanguageTranslationModule,
    ReactiveFormsModule,
    QRCodeModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [ 
    DashboardComponent, 
    DashboardIndexComponent, 
    DashboardMessageComponent, 
    DashboardOverviewComponent,
    ReportIdlingComponent,
    ReportIgnitionComponent,
    ReportOverspeedComponent,
    ReportParkingComponent,
    ReportTripComponent,
    ReportTripContentComponent,
    ReportViolationComponent,
    ReportViolationContentComponent,
    ReportRecordContentComponent,
    ReportIdlingContentComponent,
    ReportIgnitionContentComponent,
    ReportOverspeedContentComponent,
    ReportParkingContentComponent,
    ReportOverviewComponent,
    ReportOverviewContentComponent,
    ReportOnlineComponent,
    ReportOnlineContentComponent,
    ReportOfflineComponent,
    ReportOfflineContentComponent,
    ReportAlertComponent,
    ReportAlertDetailComponent,
    ReportAlertContentComponent,
    ReportAlertDetailContentComponent,
    DriveBehaviourComponent,
    DriveBehaviourContentComponent,
   ]
})
export class DashboardModule { }
