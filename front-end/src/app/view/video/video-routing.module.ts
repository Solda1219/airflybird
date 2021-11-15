import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoLiveComponent } from './video-live/video-live.component';
import { VideoTransferComponent } from './video-transfer/video-transfer.component';
import { VideoComponent } from './video.component';
import { VideoVodComponent } from './video-vod/video-vod.component';

const routes: Routes = [
  {
    path: '', component: VideoComponent, data: { title: 'Video'},
    children: [ 
      { path: '',redirectTo: 'live'},
      { path: 'live',component: VideoLiveComponent},
      { path: 'vod',component: VideoVodComponent},
      { path: 'transfer',component: VideoTransferComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule {}
