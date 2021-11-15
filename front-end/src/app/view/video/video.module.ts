import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from '../../module/language-translation.module';
import { NgxLoadingModule } from 'ngx-loading';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedComponentModule } from '../../shared-component/shared-component.module';
import { VideoLiveComponent } from './video-live/video-live.component';
import { VideoTransferComponent } from './video-transfer/video-transfer.component';
import { VideoRoutingModule } from './video-routing.module';
import { VideoLiveListModeComponent } from './video-live/video-live-list-mode/video-live-list-mode.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VideoComponent } from './video.component';
import { VideoLiveQuaterModeComponent } from './video-live/video-live-quater-mode/video-live-quater-mode.component';
import { VideoLiveSixteenModeComponent } from './video-live/video-live-sixteen-mode/video-live-sixteen-mode.component';
import { DataTableModule } from '../../module/Datatable/DataTableModule';
import { VideoVodComponent } from './video-vod/video-vod.component';
import { VideoVodContentComponent } from './video-vod/video-vod-content/video-vod-content.component';
import { LivePipe } from '../../pipe/live.pipe';

@NgModule({
  declarations: [VideoLiveComponent, VideoTransferComponent, VideoLiveListModeComponent, VideoComponent, VideoLiveQuaterModeComponent, VideoLiveSixteenModeComponent, VideoVodComponent, VideoVodContentComponent, LivePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    VideoRoutingModule,
    NgxLoadingModule.forRoot({}),
    ModalModule.forRoot(),
    TabsModule,
    DataTableModule,
    SharedComponentModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class VideoModule { }
