import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from '../../module/language-translation.module';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedComponentModule } from '../../shared-component/shared-component.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { EquipmentRoutingModule} from './equipment-routing.module'

import { EquipmentComponent } from './equipment.component';
import { EqCameraComponent } from './eq-camera/eq-camera.component';
import { EqFtpComponent } from './eq-ftp/eq-ftp.component';
import { EqGpuComponent } from './eq-gpu/eq-gpu.component';
import { EqMediaComponent } from './eq-media/eq-media.component';
import { EqCameraTableComponent } from './eq-camera/eq-camera-table/eq-camera-table.component';
import { EqFtpTableComponent } from './eq-ftp/eq-ftp-table/eq-ftp-table.component';
import { EqMediaTableComponent } from './eq-media/eq-media-table/eq-media-table.component';
import { EqGpuTableComponent } from './eq-gpu/eq-gpu-table/eq-gpu-table.component';
import { EqGpuCameralistTableComponent } from './eq-gpu/eq-gpu-cameralist-table/eq-gpu-cameralist-table.component';



@NgModule({
  declarations: [EquipmentComponent, EqCameraComponent, EqFtpComponent, EqGpuComponent, EqMediaComponent, EqCameraTableComponent, EqFtpTableComponent, EqMediaTableComponent, EqGpuTableComponent, EqGpuCameralistTableComponent],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    NgxLoadingModule.forRoot({}),
    ModalModule.forRoot(),
    TabsModule,
    SharedComponentModule,
    ProgressbarModule,
    EquipmentRoutingModule
  ]
})
export class EquipmentModule { }
