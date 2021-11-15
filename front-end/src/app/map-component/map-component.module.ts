import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRealtimeComponent } from './map-realtime/map-realtime.component';
import { BaiduMapModule } from 'angular2-baidu-map';
import { MapTripsComponent } from './map-trips/map-trips.component';
import { MapPlaybackComponent } from './map-playback/map-playback.component';



@NgModule({
  declarations: [MapRealtimeComponent, MapTripsComponent, MapPlaybackComponent],
  imports: [
    CommonModule,
    BaiduMapModule.forRoot({ ak: 'qad8aIephigVOp8wW7ppY9SLaWQClGpv' }),
  ],
  exports: [MapRealtimeComponent, MapTripsComponent, MapPlaybackComponent]
})
export class MapComponentModule { }
