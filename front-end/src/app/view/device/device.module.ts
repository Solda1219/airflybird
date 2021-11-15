// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DeviceRoutingModule } from './device-routing.module'; 
import { NgxLoadingModule } from 'ngx-loading';

import { DeviceIndexComponent } from './device-index/device-index.component';
import { LanguageTranslationModule } from '../../module/language-translation.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedComponentModule } from '../../shared-component/shared-component.module';
import { DeviceAllComponent } from './device-all/device-all.component';
import { DeviceExpComponent } from './device-exp/device-exp.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceRoutingModule,
    LanguageTranslationModule,
    NgxLoadingModule.forRoot({}),
    TabsModule,
    ModalModule.forRoot(),
    SharedComponentModule
  ],
  declarations: [
  DeviceIndexComponent,
  DeviceAllComponent,
  DeviceExpComponent,
  ]
})
export class DeviceModule { }
