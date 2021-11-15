import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from '../../module/language-translation.module';
import { NgxLoadingModule } from 'ngx-loading';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedComponentModule } from '../../shared-component/shared-component.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageCropperModule } from '../../module/image-cropper/image-cropper.module';
import { ViolationComponent } from './violation/violation.component';
import { ViolationIndexComponent } from './violation/violation-index/violation-index.component';
import { DetectComponent } from './detect.component';
import { DetectStatusComponent } from './detect-status/detect-status.component';
import { DetectRoutingModule } from './detect-routing.module';
import { DetectStatusContentComponent } from './detect-status/detect-status-content/detect-status-content.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ViolationDetailComponent } from './violation/violation-detail/violation-detail.component';
import { AppStatusComponent } from './app-status/app-status.component';
import { VodStatusComponent } from './vod-status/vod-status.component';
import { VodStatusVideoContentComponent } from './vod-status/vod-status-video-content/vod-status-video-content.component';
import { VodStatusSnapContentComponent } from './vod-status/vod-status-snap-content/vod-status-snap-content.component';


@NgModule({
  declarations: [ViolationIndexComponent,ViolationDetailComponent, ViolationComponent,ViolationIndexComponent, DetectComponent, DetectStatusComponent, DetectStatusContentComponent, AppStatusComponent, VodStatusComponent, VodStatusVideoContentComponent, VodStatusSnapContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    NgxLoadingModule.forRoot({}),
    ModalModule.forRoot(),
    TabsModule,
    DetectRoutingModule,
    SharedComponentModule,
    ProgressbarModule,
    ImageCropperModule
  ]
})
export class DetectModule { }
