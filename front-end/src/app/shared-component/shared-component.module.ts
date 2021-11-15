import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerListTreeComponent } from './customer-list-tree/customer-list-tree.component';
import { DemoMaterialModule } from '../material.module';
import { TreeviewModule } from 'ngx-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ExpirationListTreeComponent } from './expiration-list-tree/expiration-list-tree.component';
import { VehicleSearchListComponent } from './vehicle-search-list/vehicle-search-list.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AlarmAlertComponent } from './alarm-alert/alarm-alert.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    CustomerListTreeComponent,
    ExpirationListTreeComponent,
    VehicleSearchListComponent,
    AlarmAlertComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    TreeviewModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ModalModule.forRoot(),
  ],
  exports: [
    CustomerListTreeComponent,
    ExpirationListTreeComponent,
    VehicleSearchListComponent,
    DemoMaterialModule,
    AlarmAlertComponent,
    TreeviewModule,
    NgxLoadingModule,
    ModalModule,
    TabsModule,
  ]
})
export class SharedComponentModule { }
