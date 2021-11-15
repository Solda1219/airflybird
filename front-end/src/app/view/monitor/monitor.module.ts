import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorIndexComponent } from './monitor-index/monitor-index.component';
import { MonitorRoutingModule } from './monitor-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from '../../module/language-translation.module';
import { SharedComponentModule } from '../../shared-component/shared-component.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MapComponentModule } from '../../map-component/map-component.module';
import { MonitorTripsComponent } from './monitor-trips/monitor-trips.component';
import { MonitorPlaybackComponent } from './monitor-playback/monitor-playback.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({ 
  declarations: [MonitorIndexComponent, MonitorTripsComponent, MonitorPlaybackComponent],
  imports: [
    CommonModule,
    MonitorRoutingModule,
    FormsModule,
    TabsModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    SharedComponentModule,
    NgxLoadingModule,
    MapComponentModule,
    ModalModule.forRoot(),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MonitorModule { }
